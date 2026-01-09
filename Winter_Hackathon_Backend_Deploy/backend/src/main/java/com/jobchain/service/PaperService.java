package com.jobchain.service;

import com.jobchain.entity.PaperSetEntity;
import com.jobchain.entity.VacancyEntity;
import com.jobchain.repository.PaperSetRepository;
import com.jobchain.repository.VacancyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(rollbackFor = Exception.class)
public class PaperService {

    private static final List<String> PAPER_SETS = List.of("A", "B", "C", "D", "E");

    private static final BigInteger GAS_PRICE =
            BigInteger.valueOf(30_000_000_000L);
    private static final BigInteger GAS_LIMIT =
            BigInteger.valueOf(300_000);

    private final PaperSetRepository paperSetRepository;
    private final VacancyRepository vacancyRepository;
    private final BlockchainService blockchainService;

    public List<PaperSetEntity> generatePaperSets(UUID vacancyId) throws Exception {

        VacancyEntity vacancy = vacancyRepository.findById(vacancyId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Vacancy not found: " + vacancyId)
                );

        boolean enoughGas =
                blockchainService.hasEnoughBalanceForPaperSets(
                        PAPER_SETS.size(),
                        GAS_PRICE,
                        GAS_LIMIT
                );

        if (!enoughGas) {
            throw new IllegalStateException(
                    "Insufficient balance: cannot generate all paper sets safely"
            );
        }

        List<PaperSetEntity> generatedSets = new ArrayList<>();

        for (String setId : PAPER_SETS) {

            String paperContent = generatePaperContent(vacancyId, setId);
            String paperHash = sha256(paperContent);

            String txHash = blockchainService.distributePaperOnChain(
                    vacancy.getBlockchainVacancyId(),
                    setId,
                    paperHash
            );

            PaperSetEntity paperSet = PaperSetEntity.builder()
                    .vacancyId(vacancyId)
                    .setId(setId)
                    .paperHash(paperHash)
                    .isLocked(false)
                    .timestamp(LocalDateTime.now())
                    .blockchainTxHash(txHash)
                    .build();

            generatedSets.add(paperSetRepository.save(paperSet));
        }

        log.info("Generated ALL {} paper sets for vacancy {}", PAPER_SETS.size(), vacancyId);
        return generatedSets;
    }

    public void lockPaper(UUID vacancyId, String centerId) {

        List<PaperSetEntity> sets = paperSetRepository.findByVacancyId(vacancyId);

        for (PaperSetEntity set : sets) {
            set.setLocked(true);
            set.setCenterId(centerId);
        }

        paperSetRepository.saveAll(sets);
    }

    public List<PaperSetEntity> getPaperSets(UUID vacancyId) {
        return paperSetRepository.findByVacancyId(vacancyId);
    }

    private String generatePaperContent(UUID vacancyId, String setId) {
        return "VACANCY=" + vacancyId +
                "|SET=" + setId +
                "|TIME=" + System.nanoTime();
    }

    private String sha256(String input) {
        try {
            var digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes());
            return bytesToHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Hash generation failed", e);
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) sb.append(String.format("%02x", b));
        return sb.toString();
    }
}
