package com.jobchain.repository;

import com.jobchain.entity.ApplicationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<ApplicationEntity, UUID> {

    List<ApplicationEntity> findByVacancyId(UUID vacancyId);
    @Query("SELECT a.id, a.vacancyId, a.candidateName, a.email, a.category, a.appHash, " +
            "a.status, a.blockchainTxHash, a.createdAt, a.testAttempted " +
            "FROM ApplicationEntity a WHERE a.vacancyId = :vacancyId")
    List<Object[]> findApplicationsByVacancyIdWithoutLob(@Param("vacancyId") UUID vacancyId);
    Optional<ApplicationEntity> findById(UUID applicationId);

}