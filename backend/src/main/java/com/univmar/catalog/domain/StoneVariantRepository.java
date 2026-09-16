package com.univmar.catalog.domain;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface StoneVariantRepository extends JpaRepository<StoneVariant, Long> { List<StoneVariant> findByMaterialIdAndActiveTrue(Long materialId); }
