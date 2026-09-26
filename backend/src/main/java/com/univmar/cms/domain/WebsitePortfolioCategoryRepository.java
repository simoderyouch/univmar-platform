package com.univmar.cms.domain;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
public interface WebsitePortfolioCategoryRepository extends JpaRepository<WebsitePortfolioCategory, UUID> { Optional<WebsitePortfolioCategory> findBySlugIgnoreCase(String slug); List<WebsitePortfolioCategory> findAllByOrderBySortOrderAscNameAsc(); List<WebsitePortfolioCategory> findAllByActiveTrueOrderBySortOrderAscNameAsc(); }
