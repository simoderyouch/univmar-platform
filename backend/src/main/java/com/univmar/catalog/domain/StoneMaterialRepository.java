package com.univmar.catalog.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StoneMaterialRepository extends JpaRepository<StoneMaterial, Long> {
    Optional<StoneMaterial> findBySlugAndActiveTrue(String slug);

    boolean existsBySlug(String slug);

    Page<StoneMaterial> findByActiveTrue(Pageable pageable);
}
