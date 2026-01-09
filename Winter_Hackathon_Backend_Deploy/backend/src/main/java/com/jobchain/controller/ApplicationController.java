package com.jobchain.controller;

import com.jobchain.dto.ApplicationResponse;
import com.jobchain.dto.CreateApplicationRequest;
import com.jobchain.entity.ExamScoreEntity;
import com.jobchain.repository.ExamScoreRepository;
import com.jobchain.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
@Slf4j
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private ExamScoreRepository examScoreRepository;

    @PreAuthorize("hasAuthority('STUDENT')")
    @PostMapping
    public ResponseEntity<ApplicationResponse> submitApplication(
            @Valid @RequestBody CreateApplicationRequest request) {
        try {
            log.info("POST /api/applications - Submitting application for vacancy: {}",
                    request.getVacancyId());

            var application = applicationService.submitApplication(request);
            var response = mapToResponse(application);

            log.info("Application submitted successfully: id={}", application.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            throw new RuntimeException("Validation failed: " + e.getMessage());
        } catch (Exception e) {
            log.error("Failed to submit application: {}", e.getMessage());
            throw new RuntimeException("Failed to submit application: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/vacancy/{vacancyId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByVacancy(
            @PathVariable UUID vacancyId) {
        try {
            log.info("GET /api/applications/vacancy/{} - Fetching applications", vacancyId);

            List<Object[]> applicationData = applicationService.getApplicationsByVacancyWithoutLob(vacancyId);
            List<ApplicationResponse> responses = new ArrayList<>();

            for (Object[] row : applicationData) {
                if (row.length < 10) {
                    log.error("Row length is {} but expected 10", row.length);
                    continue;
                }

                UUID id = (UUID) row[0];
                UUID vacancyIdFromRow = (UUID) row[1];
                String candidateName = (String) row[2];
                String email = (String) row[3];
                String category = (String) row[4];
                String appHash = (String) row[5];
                String status = (String) row[6];
                String blockchainTxHash = (String) row[7];
                LocalDateTime createdAt = (LocalDateTime) row[8];
                boolean testAttempted = (Boolean) row[9];

                // Get marks from ExamScoreRepository
                Double marks = null;
                try {
                    Optional<ExamScoreEntity> scoreOpt = examScoreRepository.findByApplicationId(id);
                    marks = scoreOpt.map(ExamScoreEntity::getMarks).orElse(null);
                } catch (Exception e) {
                    log.warn("Could not fetch marks for application {}: {}", id, e.getMessage());
                }

                ApplicationResponse response = ApplicationResponse.builder()
                        .id(id)
                        .vacancyId(vacancyIdFromRow)
                        .candidateName(candidateName)
                        .email(email)
                        .category(category)
                        .appHash(appHash)
                        .status(status)
                        .blockchainTxHash(blockchainTxHash)
                        .createdAt(createdAt)
                        .testAttempted(testAttempted)
                        .marks(marks)
                        .build();

                responses.add(response);
            }

            log.info("Retrieved {} applications for vacancy", responses.size());
            return ResponseEntity.ok(responses);

        } catch (Exception e) {
            log.error("Failed to fetch applications: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch applications: " + e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplicationById(@PathVariable UUID id) {
        try {
            log.info("GET /api/applications/{} - Fetching application", id);

            var applicationOpt = applicationService.getApplicationById(id);

            if (applicationOpt.isEmpty()) {
                log.warn("Application not found: {}", id);
                return ResponseEntity.notFound().build();
            }

            var response = mapToResponse(applicationOpt.get());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Failed to fetch application: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch application: " + e.getMessage());
        }
    }

    private ApplicationResponse mapToResponse(com.jobchain.entity.ApplicationEntity entity) {
        Optional<ExamScoreEntity> scoreOpt = examScoreRepository.findByApplicationId(entity.getId());
        Double marks = scoreOpt.map(ExamScoreEntity::getMarks).orElse(null);

        return ApplicationResponse.builder()
                .id(entity.getId())
                .vacancyId(entity.getVacancyId())
                .candidateName(entity.getCandidateName())
                .email(entity.getEmail())
                .category(entity.getCategory())
                .appHash(entity.getAppHash())
                .status(entity.getStatus())
                .blockchainTxHash(entity.getBlockchainTxHash())
                .createdAt(entity.getCreatedAt())
                .marks(marks)
                .testAttempted(entity.isTestAttempted())
                .build();
    }
}