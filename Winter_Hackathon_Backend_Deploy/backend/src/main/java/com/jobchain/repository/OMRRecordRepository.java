package com.jobchain.repository;

import com.jobchain.entity.OMRRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OMRRecordRepository extends JpaRepository<OMRRecordEntity, UUID> {

    Optional<OMRRecordEntity> findByCandidateId(String candidateId);

    Optional<OMRRecordEntity> findByVacancyId(UUID vacancyId);
}