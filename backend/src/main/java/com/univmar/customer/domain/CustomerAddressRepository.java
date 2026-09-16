package com.univmar.customer.domain;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CustomerAddressRepository extends JpaRepository<CustomerAddress, Long> {
    List<CustomerAddress> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    Optional<CustomerAddress> findByIdAndCustomerId(Long id, Long customerId);
    List<CustomerAddress> findByCustomerIdAndDefaultDeliveryTrue(Long customerId);
}
