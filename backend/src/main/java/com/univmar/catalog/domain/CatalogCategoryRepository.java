package com.univmar.catalog.domain;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatalogCategoryRepository extends JpaRepository<CatalogCategory, Long> {
    List<CatalogCategory> findByActiveTrueOrderByDisplayOrderAsc();
    List<CatalogCategory> findAllByOrderByDisplayOrderAsc();
    Optional<CatalogCategory> findByNameIgnoreCase(String name);
    boolean existsBySlugAndIdNot(String slug, Long id);
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
