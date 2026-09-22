package com.univmar.document.domain;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessDocumentRepository extends JpaRepository<BusinessDocument, UUID> {
    List<BusinessDocument> findAllByTargetTypeAndTargetIdOrderByCreatedAtDesc(DocumentTargetType targetType, UUID targetId);
}
