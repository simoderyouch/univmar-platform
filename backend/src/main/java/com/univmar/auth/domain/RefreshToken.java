package com.univmar.auth.domain;

import com.univmar.shared.domain.BaseEntity;
import com.univmar.user.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity @Table(name = "refresh_tokens")
public class RefreshToken extends BaseEntity {
    @ManyToOne(optional = false) @JoinColumn(name = "user_id", nullable = false) private User user;
    @Column(nullable = false, unique = true, length = 128) private String token;
    @Column(nullable = false) private Instant expiresAt;
    @Column(nullable = false) private boolean revoked;
    protected RefreshToken() { }
    public RefreshToken(User user, String token, Instant expiresAt) { this.user = user; this.token = token; this.expiresAt = expiresAt; }
    public User getUser() { return user; } public String getToken() { return token; }
    public boolean isUsable() { return !revoked && expiresAt.isAfter(Instant.now()); }
    public void revoke() { revoked = true; }
}
