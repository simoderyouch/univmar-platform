package com.univmar.catalog.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatalogCategoryRepository extends JpaRepository<CatalogCategory, Long> {
    List<CatalogCategory> findByActiveTrueOrderByDisplayOrderAsc();
}
