package com.univmar.quotation.domain;

import jakarta.persistence.LockModeType;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuotationRepository extends JpaRepository<Quotation, Long> {
    Optional<Quotation> findByIdAndRequestCustomerId(Long id, Long customerId);
    List<Quotation> findByRequestCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Quotation> findByStatusAndValidUntilBefore(QuotationStatus status, LocalDate validUntil);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select q from Quotation q join fetch q.request request where q.id = :quotationId and request.customer.id = :customerId")
    Optional<Quotation> findOwnedForAcceptance(@Param("quotationId") Long quotationId, @Param("customerId") Long customerId);
}
