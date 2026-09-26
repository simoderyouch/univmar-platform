package com.univmar.project.domain;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRealizationImageRepository extends JpaRepository<ProjectRealizationImage, UUID> {
    List<ProjectRealizationImage> findByProjectIdOrderByPositionAscCreatedAtAsc(UUID projectId);
    Optional<ProjectRealizationImage> findByIdAndProjectId(UUID id, UUID projectId);
    long countByProjectId(UUID projectId);
}
