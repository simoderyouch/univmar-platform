package com.univmar.customer.domain;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CustomerProjectRepository extends JpaRepository<CustomerProject, Long> {
    List<CustomerProject> findByCustomerIdOrderByUpdatedAtDesc(Long customerId);
    Optional<CustomerProject> findByIdAndCustomerId(Long id, Long customerId);
}
