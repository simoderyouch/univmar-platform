package com.univmar.catalog.domain;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialCategoryRepository extends JpaRepository<MaterialCategory, UUID> {
    Optional<MaterialCategory> findBySlugIgnoreCase(String slug);
    List<MaterialCategory> findAllByOrderBySortOrderAscNameAsc();
    List<MaterialCategory> findAllByActiveTrueAndWebsiteVisibleTrueOrderBySortOrderAscNameAsc();
}
