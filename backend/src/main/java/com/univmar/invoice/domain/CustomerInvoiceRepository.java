package com.univmar.invoice.domain;

import jakarta.persistence.LockModeType;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

public interface CustomerInvoiceRepository extends JpaRepository<CustomerInvoice, UUID>, JpaSpecificationExecutor<CustomerInvoice> {
    Optional<CustomerInvoice> findByOrderId(UUID orderId);
    @Lock(LockModeType.PESSIMISTIC_WRITE) @Query("select i from CustomerInvoice i where i.id = :id") Optional<CustomerInvoice> findByIdForUpdate(UUID id);
}
