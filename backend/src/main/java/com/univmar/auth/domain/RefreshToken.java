package com.univmar.auth.domain;

import com.univmar.shared.domain.BaseEntity;
import com.univmar.user.domain.User;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken extends BaseEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(nullable = false, unique = true, length = 128)
    private String tokenHash;
    @Column(nullable = false)
    private Instant expiresAt;
    private Instant revokedAt;

    protected RefreshToken() {
    }

    public RefreshToken(User user, String tokenHash, Instant expiresAt) {
        this.user = user;
        this.tokenHash = tokenHash;
        this.expiresAt = expiresAt;
    }

    public User getUser() {
        return user;
    }

    public String getTokenHash() {
        return tokenHash;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public Instant getRevokedAt() {
        return revokedAt;
    }

    public boolean isUsable() {
        return revokedAt == null && expiresAt.isAfter(Instant.now());
    }

    public void revoke() {
        if (revokedAt == null) revokedAt = Instant.now();
    }
}
