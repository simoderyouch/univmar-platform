package com.univmar.rfq.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RfqAttachmentRepository extends JpaRepository<RfqAttachment, Long> {
    List<RfqAttachment> findByRequestIdOrderByCreatedAtDesc(Long requestId);

    Optional<RfqAttachment> findByIdAndRequestCustomerId(Long id, Long customerId);
}
