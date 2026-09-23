package com.univmar.fabrication.domain;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FabricationJobRepository extends JpaRepository<FabricationJob, UUID> { List<FabricationJob> findAllByStatus(FabricationStatus status); }
