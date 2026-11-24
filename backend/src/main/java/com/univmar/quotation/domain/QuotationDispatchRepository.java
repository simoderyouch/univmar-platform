package com.univmar.quotation.domain;

import jakarta.persistence.LockModeType;
import java.util.*;
import org.springframework.data.jpa.repository.*;

public interface QuotationDispatchRepository
    extends JpaRepository<QuotationDispatch, UUID>
{
    List<QuotationDispatch> findAllByQuotationIdOrderByCreatedAtDesc(
        UUID quotationId
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select d from QuotationDispatch d where d.tokenHash = :tokenHash")
    Optional<QuotationDispatch> findByTokenHashForUpdate(String tokenHash);

    Optional<QuotationDispatch> findByTokenHash(String tokenHash);
}
