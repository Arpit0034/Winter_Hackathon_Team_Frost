package com.jobchain.service;

import com.jobchain.dto.ExamPaperResponse;
import com.jobchain.dto.OmrSubmitRequest;
import com.jobchain.dto.QuestionDto;
import com.jobchain.entity.*;
import com.jobchain.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class ExamService {

    @Autowired
    private VacancyRepository vacancyRepository ;

    @Autowired
    private ExamScoreRepository examScoreRepository;

    @Autowired
    private MeritListRepository meritListRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private OMRRecordRepository omrRecordRepository ;

    @Autowired
    private BlockchainService blockchainService;

    @Autowired
    private FraudDetectionService fraudDetectionService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public ExamScoreEntity recordExamScore(
            UUID vacancyId,
            UUID applicationId,
            double marks,
            String markingJson
    ) throws Exception {

        log.info("Recording exam score for application: {}, marks: {}", applicationId, marks);

        // Check if marks already recorded
        Optional<ExamScoreEntity> existingScore = examScoreRepository.findByApplicationId(applicationId);

        // If exists AND has blockchainTxHash, don't allow update
        if (existingScore.isPresent() && existingScore.get().getBlockchainTxHash() != null) {
            throw new IllegalStateException(
                    "Marks already recorded on blockchain for application: " + applicationId
            );
        }

        if (marks < 0 || marks > 100) {
            throw new IllegalArgumentException("Marks must be between 0 and 100");
        }

        ApplicationEntity app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        VacancyEntity vacancy = vacancyRepository.findById(vacancyId)
                .orElseThrow(() -> new RuntimeException("Vacancy not found"));

        if (markingJson == null || markingJson.isBlank()) {
            markingJson = "{\"type\":\"MANUAL_ADMIN\",\"timestamp\":\"" +
                    new Date().toString() + "\"}";
        }

        String markingHash = sha256(markingJson);

        // Blockchain record - ADMIN can record marks without OMR verification
        String txHash = blockchainService.recordExamScoreOnChain(
                vacancy.getBlockchainVacancyId(),
                (int) marks,
                markingHash
        );

        ExamScoreEntity score;

        if (existingScore.isPresent()) {
            // Update existing score (without blockchainTxHash)
            score = existingScore.get();
            score.setMarks(marks);
            score.setMarkingJson(markingJson);
            score.setMarkingHash(markingHash);
            score.setBlockchainTxHash(txHash);
        } else {
            // Create new score
            score = ExamScoreEntity.builder()
                    .vacancyId(vacancyId)
                    .applicationId(applicationId)
                    .marks(marks)
                    .markingJson(markingJson)
                    .markingHash(markingHash)
                    .blockchainTxHash(txHash)
                    .build();
        }

        log.info("Exam score recorded successfully. Application: {}, Marks: {}, TX: {}",
                applicationId, marks, txHash);

        return examScoreRepository.save(score);
    }

    public MeritListEntity publishMerit(UUID vacancyId) {
        if (meritListRepository.existsByVacancyId(vacancyId)) {
            throw new IllegalStateException(
                    "Merit list already published for this vacancy"
            );
        }
        try {
            log.info("Publishing merit list for vacancyId: {}", vacancyId);

            List<ApplicationEntity> applications =
                    applicationRepository.findByVacancyId(vacancyId);

            if (applications.isEmpty()) {
                throw new IllegalArgumentException(
                        "No applications found for vacancy: " + vacancyId);
            }

            List<Object[]> scoreRows =
                    examScoreRepository.findApplicationIdAndMarksByVacancyId(vacancyId);

            if (scoreRows.isEmpty()) {
                throw new IllegalArgumentException(
                        "No exam scores found for vacancy: " + vacancyId);
            }

            List<Map<String, Object>> meritData = scoreRows.stream()
                    .map(row -> {
                        UUID applicationId = (UUID) row[0];
                        Double marks = (Double) row[1];

                        Map<String, Object> entry = new HashMap<>();
                        entry.put("applicationId", applicationId.toString());
                        entry.put("marks", marks);
                        return entry;
                    })
                    .sorted((m1, m2) ->
                            Double.compare(
                                    (Double) m2.get("marks"),
                                    (Double) m1.get("marks")
                            ))
                    .collect(Collectors.toList());

            for (int i = 0; i < meritData.size(); i++) {
                meritData.get(i).put("rank", i + 1);
            }

            String meritJson = objectMapper.writeValueAsString(meritData);
            String meritHash = sha256(meritJson);

            VacancyEntity vacancy =
                    vacancyRepository.findById(vacancyId)
                            .orElseThrow(() -> new IllegalArgumentException("Vacancy not found"));

            String txHash =
                    blockchainService.publishMeritOnChain(
                            vacancy.getBlockchainVacancyId(),
                            meritHash
                    );

            fraudDetectionService.detectPaperLeak(vacancyId);
            fraudDetectionService.detectMarksAnomaly(vacancyId);

            MeritListEntity meritList = MeritListEntity.builder()
                    .vacancyId(vacancyId)
                    .meritJson(meritJson)
                    .meritHash(meritHash)
                    .blockchainTxHash(txHash)
                    .verified(true)
                    .build();

            MeritListEntity saved =
                    meritListRepository.save(meritList);

            log.info("Merit list published successfully: id={}, txHash={}",
                    saved.getId(), txHash);

            return saved;

        } catch (Exception e) {
            log.error("Failed to publish merit list: {}", e.getMessage(), e);
            throw new RuntimeException("Merit list publication failed", e);
        }
    }

    public MeritListEntity getMeritList(UUID vacancyId) {
        try {
            log.info("Fetching merit list for vacancyId: {}", vacancyId);

            Optional<MeritListEntity> meritList = meritListRepository.findByVacancyId(vacancyId);
            if (!meritList.isPresent()) {
                throw new IllegalArgumentException("Merit list not found for vacancy: " + vacancyId);
            }

            log.info("Merit list retrieved successfully");
            return meritList.get();

        } catch (Exception e) {
            log.error("Failed to fetch merit list: {}", e.getMessage());
            throw new RuntimeException("Merit list retrieval failed", e);
        }
    }

    public boolean verifyMeritIntegrity(UUID vacancyId) {
        try {
            log.info("Verifying merit list integrity for vacancyId: {}", vacancyId);

            Optional<MeritListEntity> meritListOpt = meritListRepository.findByVacancyId(vacancyId);
            if (!meritListOpt.isPresent()) {
                log.warn("Merit list not found for verification");
                return false;
            }

            MeritListEntity meritList = meritListOpt.get();
            String recalculatedHash = sha256(meritList.getMeritJson());
            boolean isValid = recalculatedHash.equals(meritList.getMeritHash());

            if (isValid) {
                log.info("Merit list integrity verified: VALID");
            } else {
                log.error("Merit list integrity verification FAILED: TAMPERING DETECTED!");
            }

            return isValid;

        } catch (Exception e) {
            log.error("Failed to verify merit list integrity: {}", e.getMessage());
            return false;
        }
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Hash calculation failed", e);
        }
    }

    public boolean isEligible(UUID applicationId) {
        ApplicationEntity app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        return !app.isTestAttempted();
    }

    public ExamPaperResponse getPaper(UUID vacancyId) {
        List<QuestionDto> questions = Collections.emptyList();
        Map<String, String> markingScheme = Collections.emptyMap();
        return new ExamPaperResponse(questions, markingScheme);
    }

    @Transactional
    public void submitOmr(OmrSubmitRequest request) {
        ApplicationEntity app = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (app.isTestAttempted()) {
            throw new RuntimeException("Test already attempted");
        }

        try {
            String omrJson = objectMapper.writeValueAsString(request.getOmrAnswers());
            String omrHash = sha256(omrJson);

            OMRRecordEntity omr = OMRRecordEntity.builder()
                    .candidateId(app.getId().toString())
                    .vacancyId(app.getVacancyId())
                    .omrJson(omrJson)
                    .omrHash(omrHash)
                    .qrCodeData("APP-" + app.getId())
                    .scanTimestamp(LocalDateTime.now())
                    .build();

            omrRecordRepository.save(omr);

            app.setTestAttempted(true);
            app.setOmrAnswerJson(omrJson);
            app.setAnswerHash(omrHash);
            applicationRepository.save(app);

        } catch (Exception e) {
            throw new RuntimeException("OMR submission failed", e);
        }
    }
}