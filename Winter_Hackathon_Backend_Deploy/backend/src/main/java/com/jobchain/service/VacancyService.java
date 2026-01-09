package com.jobchain.service;

import com.jobchain.entity.VacancyEntity;
import com.jobchain.repository.VacancyRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.web3j.protocol.core.methods.response.TransactionReceipt;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@Transactional
public class VacancyService {

    @Autowired
    private VacancyRepository vacancyRepository;

    @Autowired
    private BlockchainService blockchainService;

    public VacancyEntity createVacancy(String title, int totalPosts, String paperHash) throws Exception {

        TransactionReceipt receipt =
                blockchainService.createVacancyAndReturnReceipt(
                        title,
                        totalPosts,
                        paperHash
                );

        Long blockchainVacancyId =
                blockchainService.extractVacancyId(receipt);

        VacancyEntity vacancy = VacancyEntity.builder()
                .blockchainVacancyId(blockchainVacancyId)
                .title(title)
                .totalPosts(totalPosts)
                .paperHash(paperHash)
                .blockchainTxHash(receipt.getTransactionHash())
                .build();

        return vacancyRepository.save(vacancy);
    }


    public List<VacancyEntity> getAllVacancies() {
        try {
            log.info("Fetching all vacancies");
            List<VacancyEntity> vacancies = vacancyRepository.findAll();
            log.info("Retrieved {} vacancies", vacancies.size());
            return vacancies;
        } catch (Exception e) {
            log.error("Failed to fetch vacancies: {}", e.getMessage());
            throw new RuntimeException("Failed to retrieve vacancies", e);
        }
    }

    public Optional<VacancyEntity> getVacancyById(UUID id) {
        try {
            log.info("Fetching vacancy by id: {}", id);
            Optional<VacancyEntity> vacancy = vacancyRepository.findById(id);
            if (vacancy.isPresent()) {
                log.info("Vacancy found: {}", id);
            } else {
                log.warn("Vacancy not found: {}", id);
            }
            return vacancy;
        } catch (Exception e) {
            log.error("Failed to fetch vacancy: {}", e.getMessage());
            throw new RuntimeException("Failed to retrieve vacancy", e);
        }
    }

    public void deleteVacancy(UUID id) {
        try {
            log.info("Deleting vacancy: {}", id);

            if (!vacancyRepository.existsById(id)) {
                throw new IllegalArgumentException("Vacancy not found: " + id);
            }

            vacancyRepository.deleteById(id);
            log.info("Vacancy deleted successfully: {}", id);

        } catch (Exception e) {
            log.error("Failed to delete vacancy: {}", e.getMessage());
            throw new RuntimeException("Vacancy deletion failed", e);
        }
    }
}