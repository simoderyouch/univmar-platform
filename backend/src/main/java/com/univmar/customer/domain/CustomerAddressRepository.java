package com.univmar.customer.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerAddressRepository extends JpaRepository<CustomerAddress, Long> {
    List<CustomerAddress> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    Optional<CustomerAddress> findByIdAndCustomerId(Long id, Long customerId);

    List<CustomerAddress> findByCustomerIdAndDefaultDeliveryTrue(Long customerId);

    List<CustomerAddress> findByCustomerIdAndDefaultAddressTrue(Long customerId);

    List<CustomerAddress> findByCustomerIdAndTypeOrderByCreatedAtDesc(Long customerId, AddressType type);
}
