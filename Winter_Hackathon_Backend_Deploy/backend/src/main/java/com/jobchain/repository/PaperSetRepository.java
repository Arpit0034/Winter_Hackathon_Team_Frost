package com.jobchain.repository;

import com.jobchain.entity.PaperSetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaperSetRepository extends JpaRepository<PaperSetEntity, UUID> {

    List<PaperSetEntity> findByVacancyId(UUID vacancyId);
}