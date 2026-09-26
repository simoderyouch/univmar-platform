package com.univmar.quotation.domain;

import java.util.*;
import org.springframework.data.jpa.repository.*;
import jakarta.persistence.LockModeType;

public interface QuotationDispatchRepository extends JpaRepository<QuotationDispatch, UUID> {
    List<QuotationDispatch> findAllByQuotationIdOrderByCreatedAtDesc(UUID quotationId);
    @Lock(LockModeType.PESSIMISTIC_WRITE) @Query("select d from QuotationDispatch d where d.tokenHash = :tokenHash") Optional<QuotationDispatch> findByTokenHashForUpdate(String tokenHash);
    Optional<QuotationDispatch> findByTokenHash(String tokenHash);
}
