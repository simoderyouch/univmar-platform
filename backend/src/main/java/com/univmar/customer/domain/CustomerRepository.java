package com.univmar.customer.domain;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.*;

public interface CustomerRepository
    extends JpaRepository<Customer, UUID>, JpaSpecificationExecutor<Customer>
{
    Optional<Customer> findFirstByEmailIgnoreCase(String email);

    Optional<Customer> findFirstByPhone(String phone);
}
