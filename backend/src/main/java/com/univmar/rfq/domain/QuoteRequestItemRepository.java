package com.univmar.rfq.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuoteRequestItemRepository extends JpaRepository<QuoteRequestItem, Long> {
    List<QuoteRequestItem> findByRequestId(Long requestId);
}
