package com.univmar.user.domain;

import java.util.Optional;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmailIgnoreCase(String email);
    long countByRoleAndActiveTrue(Role role);
    List<User> findAllByRoleAndActiveTrue(Role role);
}
