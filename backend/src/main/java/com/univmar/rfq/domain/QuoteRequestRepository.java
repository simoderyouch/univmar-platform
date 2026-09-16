package com.univmar.rfq.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuoteRequestRepository extends JpaRepository<QuoteRequest, Long> {
    List<QuoteRequest> findByCustomerId(Long customerId);
}
