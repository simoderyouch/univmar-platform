package com.univmar.customer.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerProjectRepository extends JpaRepository<CustomerProject, Long> {
    List<CustomerProject> findByCustomerIdOrderByUpdatedAtDesc(Long customerId);

    Optional<CustomerProject> findByIdAndCustomerId(Long id, Long customerId);
}
