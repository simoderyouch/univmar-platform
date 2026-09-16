package com.univmar.customer.domain;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CustomerProfileRepository extends JpaRepository<CustomerProfile, Long> { Optional<CustomerProfile> findByUserId(Long userId); }
