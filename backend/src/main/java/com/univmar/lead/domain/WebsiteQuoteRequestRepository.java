package com.univmar.lead.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WebsiteQuoteRequestRepository extends JpaRepository<WebsiteQuoteRequest, Long> {
    Page<WebsiteQuoteRequest> findByStatus(WebsiteLeadStatus status, Pageable pageable);
}
