package com.jobchain.repository;

import com.jobchain.entity.MeritListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MeritListRepository extends JpaRepository<MeritListEntity, UUID> {

    Optional<MeritListEntity> findByVacancyId(UUID vacancyId);
    boolean existsByVacancyId(UUID vacancyId);
}