package com.univmar.quotation.domain;

import jakarta.persistence.LockModeType;
import java.util.*;
import org.springframework.data.jpa.repository.*;

public interface QuotationRepository extends JpaRepository<Quotation,UUID>,JpaSpecificationExecutor<Quotation>{
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select q from Quotation q where q.id = :id")
    Optional<Quotation> findByIdForUpdate(UUID id);
}
