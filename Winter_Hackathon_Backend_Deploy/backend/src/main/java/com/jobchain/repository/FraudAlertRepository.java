package com.jobchain.repository;

import com.jobchain.entity.FraudAlertEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FraudAlertRepository extends JpaRepository<FraudAlertEntity, UUID> {

    List<FraudAlertEntity> findByVacancyId(UUID vacancyId);
}