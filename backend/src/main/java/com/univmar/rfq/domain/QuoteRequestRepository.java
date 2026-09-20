package com.univmar.rfq.domain;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface QuoteRequestRepository extends JpaRepository<QuoteRequest, UUID>, JpaSpecificationExecutor<QuoteRequest> {
    Optional<QuoteRequest> findTopByOrderByCreatedAtDesc();
}
