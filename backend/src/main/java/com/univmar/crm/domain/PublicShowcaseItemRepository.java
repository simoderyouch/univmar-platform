package com.univmar.crm.domain;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublicShowcaseItemRepository extends JpaRepository<PublicShowcaseItem, UUID> {
    boolean existsByProjectId(UUID projectId);
    List<PublicShowcaseItem> findAllByKindOrderBySortOrderAscCreatedAtDesc(ShowcaseKind kind);
    List<PublicShowcaseItem> findAllByKindAndPublishedTrueOrderBySortOrderAscCreatedAtDesc(ShowcaseKind kind);
}
