package com.jobchain.controller;

import com.jobchain.dto.*;
import com.jobchain.entity.ApplicationEntity;
import com.jobchain.entity.ExamScoreEntity;
import com.jobchain.entity.MeritListEntity;
import com.jobchain.repository.ApplicationRepository;
import com.jobchain.service.ApplicationService;
import com.jobchain.service.BlockchainService;
import com.jobchain.service.ExamService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.bouncycastle.util.encoders.Hex;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exam")
@Slf4j
public class ExamController {

    @Autowired
    private ExamService examService;

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private BlockchainService blockchainService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/record-score")
    public ResponseEntity<ExamScoreResponse> recordExamScore(
            @Valid @RequestBody RecordExamScoreRequest request) throws Exception {

        log.info(
                "POST /api/exam/record-score - Recording score for application: {}",
                request.getApplicationId()
        );

        // 1️⃣ Validate application exists
        ApplicationEntity application =
                applicationService.getApplicationById(request.getApplicationId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Application not found: " + request.getApplicationId()
                                )
                        );

        // 2️⃣ Validate vacancy mapping
        if (!application.getVacancyId().equals(request.getVacancyId())) {
            throw new IllegalArgumentException(
                    "Application does not belong to given vacancy"
            );
        }

        // 3️⃣ Record exam score (ADMIN manual)
        ExamScoreEntity examScore =
                examService.recordExamScore(
                        request.getVacancyId(),
                        request.getApplicationId(),
                        request.getMarks(),
                        request.getMarkingJson()
                );

        ExamScoreResponse response = new ExamScoreResponse();
        response.setId(examScore.getId());
        response.setApplicationId(examScore.getApplicationId());
        response.setMarks(examScore.getMarks());
        response.setMarkingHash(examScore.getMarkingHash());
        response.setBlockchainTxHash(examScore.getBlockchainTxHash());

        log.info(
                "Exam score recorded successfully: id={}",
                examScore.getId()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/publish-merit")
    public ResponseEntity<PublishMeritResponse> publishMerit(@RequestParam UUID vacancyId) {
        try {
            log.info("POST /api/exam/publish-merit - Publishing merit for vacancy: {}", vacancyId);

            MeritListEntity meritList = examService.publishMerit(vacancyId);

            List<Map<String, Object>> meritData = objectMapper.readValue(
                    meritList.getMeritJson(),
                    new TypeReference<List<Map<String, Object>>>() {}
            );

            Map<String, Map<String, String>> appMap = applicationService.getApplicationsMapByVacancy(vacancyId);

            List<MeritItemResponse> meritItems = meritData.stream()
                    .map(item -> {
                        MeritItemResponse merit = new MeritItemResponse();
                        merit.setRank((Integer) item.get("rank"));

                        String appId = (String) item.get("applicationId");
                        Map<String, String> appInfo = appMap.get(appId);

                        if (appInfo != null) {
                            merit.setCandidateName(appInfo.get("candidateName"));
                            merit.setCategory(appInfo.get("category"));
                        } else {
                            merit.setCandidateName("Unknown");
                            merit.setCategory("N/A");
                        }

                        merit.setMarks((Double) item.get("marks"));
                        return merit;
                    })
                    .collect(Collectors.toList());

            PublishMeritResponse response = new PublishMeritResponse();
            response.setVacancyId(vacancyId);
            response.setMeritList(meritItems);
            response.setMeritHash(meritList.getMeritHash());
            response.setBlockchainTxHash(meritList.getBlockchainTxHash());

            log.info("Merit list published successfully with {} candidates", meritItems.size());
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            throw new RuntimeException("Validation failed: " + e.getMessage());
        } catch (Exception e) {
            log.error("Failed to publish merit list: {}", e.getMessage());
            throw new RuntimeException("Failed to publish merit list: " + e.getMessage());
        }
    }

    @GetMapping("/merit")
    public ResponseEntity<GetMeritResponse> getMeritList(@RequestParam UUID vacancyId) {
        try {
            log.info("GET /api/exam/merit - Fetching merit list for vacancy: {}", vacancyId);

            MeritListEntity meritList = examService.getMeritList(vacancyId);

            List<Map<String, Object>> meritData = objectMapper.readValue(
                    meritList.getMeritJson(),
                    new TypeReference<List<Map<String, Object>>>() {}
            );

            Map<String, Map<String, String>> appMap = applicationService.getApplicationsMapByVacancy(vacancyId);

            List<MeritItemResponse> meritItems = meritData.stream()
                    .map(item -> {
                        MeritItemResponse merit = new MeritItemResponse();
                        merit.setRank((Integer) item.get("rank"));

                        String appId = (String) item.get("applicationId");
                        Map<String, String> appInfo = appMap.get(appId);

                        if (appInfo != null) {
                            merit.setCandidateName(appInfo.get("candidateName"));
                            merit.setCategory(appInfo.get("category"));
                        } else {
                            merit.setCandidateName("Unknown");
                            merit.setCategory("N/A");
                        }

                        merit.setMarks((Double) item.get("marks"));
                        return merit;
                    })
                    .collect(Collectors.toList());

            GetMeritResponse response = new GetMeritResponse();
            response.setMeritList(meritItems);
            response.setMeritHash(meritList.getMeritHash());
            response.setBlockchainTxHash(meritList.getBlockchainTxHash());
            response.setVerified(meritList.isVerified());

            log.info("Merit list retrieved successfully with {} candidates", meritItems.size());
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.error("Merit list not found: {}", e.getMessage());
            throw new RuntimeException("Merit list not found: " + e.getMessage());
        } catch (Exception e) {
            log.error("Failed to fetch merit list: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch merit list: " + e.getMessage());
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String, Boolean>> verifyMeritIntegrity(@RequestParam UUID vacancyId) {
        try {
            log.info("GET /api/exam/verify - Verifying merit integrity for vacancy: {}", vacancyId);

            boolean verified = examService.verifyMeritIntegrity(vacancyId);

            Map<String, Boolean> result = new HashMap<>();
            result.put("verified", verified);

            if (verified) {
                log.info("✅ Merit verification result: VALID");
            } else {
                log.error("🚨 Merit verification result: TAMPERED");
            }

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Failed to verify merit integrity: {}", e.getMessage());
            throw new RuntimeException("Failed to verify merit integrity: " + e.getMessage());
        }
    }

    @GetMapping("/is-eligible/{applicationId}")
    public boolean isEligible(@PathVariable UUID applicationId) {
        return examService.isEligible(applicationId);
    }

    @GetMapping("/paper/{vacancyId}")
    public ExamPaperResponse getPaper(@PathVariable UUID vacancyId) {
        return examService.getPaper(vacancyId);
    }

    @PostMapping("/submit-omr")
    public ResponseEntity<String> submitOmr(@RequestBody OmrSubmitRequest request) {
        examService.submitOmr(request);

        return ResponseEntity.ok("OMR submitted to database successfully. Use /record-omr for blockchain.");
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/record-omr")
    public ResponseEntity<?> recordOmrOnChain(@Valid @RequestBody RecordOmrRequest request) {
        try {
            log.info("POST /api/exam/record-omr - Recording OMR on blockchain for application: {}",
                    request.getApplicationId());

            ApplicationEntity application = applicationService.getApplicationById(request.getApplicationId())
                    .orElseThrow(() -> new IllegalArgumentException("Application not found"));

            String omrHash = generateOmrHash(request.getQrData(), request.getApplicationId());

            String qrHash = generateHash(request.getQrData());

            String txHash = blockchainService.recordOmrScanOnChain(omrHash, qrHash);

            application.setOmrVerified(true);
            application.setOmrBlockchainTxHash(txHash);
            application.setOmrVerifiedAt(new Date());
            applicationRepository.save(application);

            log.info("OMR recorded on blockchain successfully. TX: {}", txHash);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("txHash", txHash);
            response.put("message", "OMR recorded on blockchain");
            response.put("applicationId", request.getApplicationId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to record OMR on blockchain: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Blockchain recording failed: " + e.getMessage()));
        }
    }

    private String generateOmrHash(String qrData, UUID applicationId) {
        String data = String.format("OMR:%s:APP:%s:TIME:%d",
                qrData, applicationId.toString(), System.currentTimeMillis());
        return generateHash(data);
    }

    private String generateHash(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            return "0x" + Hex.toHexString(hashBytes);
        } catch (Exception e) {
            log.error("Failed to generate hash, using fallback: {}", e.getMessage());
            return "0x" + Integer.toHexString(data.hashCode());
        }
    }
}