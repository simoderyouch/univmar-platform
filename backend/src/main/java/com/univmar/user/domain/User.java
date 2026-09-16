package com.univmar.user.domain;

import com.univmar.shared.domain.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "app_users")
public class User extends BaseEntity {
    @Column(nullable = false, unique = true, length = 320)
    private String email;
    @Column(nullable = false)
    private String passwordHash;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private Role role;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private AccountStatus status = AccountStatus.ACTIVE;

    protected User() {
    }

    public User(String email, String passwordHash, Role role) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public Role getRole() {
        return role;
    }

    public AccountStatus getStatus() {
        return status;
    }

    public void disable() {
        status = AccountStatus.DISABLED;
    }

    public void enable() {
        status = AccountStatus.ACTIVE;
    }

    public void markPending() {
        status = AccountStatus.PENDING;
    }

    public void lock() {
        status = AccountStatus.LOCKED;
    }

    public void updateStatus(AccountStatus status) {
        this.status = status;
    }

    public void changeRole(Role role) {
        this.role = role;
    }

    public void changePassword(String passwordHash) {
        this.passwordHash = passwordHash;
    }
}
