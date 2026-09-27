package com.univmar.cms.domain;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
public interface WebsitePortfolioProjectRepository extends JpaRepository<WebsitePortfolioProject, UUID> { Optional<WebsitePortfolioProject> findByProjectId(UUID projectId); boolean existsByProjectId(UUID projectId); List<WebsitePortfolioProject> findAllByOrderBySortOrderAsc(); List<WebsitePortfolioProject> findAllByPublishedTrueOrderBySortOrderAsc(); List<WebsitePortfolioProject> findAllByPublishedTrueAndFeaturedTrueOrderBySortOrderAsc(); List<WebsitePortfolioProject> findAllByPublishedTrueAndVariantsIdOrderBySortOrderAsc(UUID variantId); }
