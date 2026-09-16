package com.univmar.quotation.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuotationItemRepository extends JpaRepository<QuotationItem, Long> {
    List<QuotationItem> findByQuotationId(Long quotationId);
}
