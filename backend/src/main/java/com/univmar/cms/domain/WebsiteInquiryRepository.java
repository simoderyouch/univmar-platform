package com.univmar.cms.domain;

import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

public interface WebsiteInquiryRepository extends JpaRepository<WebsiteInquiry, UUID>, JpaSpecificationExecutor<WebsiteInquiry> {
    java.util.List<WebsiteInquiry> findTop25ByNotificationStatusInOrderByCreatedAtAsc(java.util.Collection<WebsiteInquiryNotificationStatus> statuses);
    boolean existsByQualifiedProjectId(UUID projectId);
    Optional<WebsiteInquiry> findByQualifiedProjectId(UUID projectId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select inquiry from WebsiteInquiry inquiry where inquiry.id = :id")
    Optional<WebsiteInquiry> findByIdForUpdate(UUID id);
}
