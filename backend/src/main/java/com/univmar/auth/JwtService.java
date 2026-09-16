package com.univmar.auth;

import com.univmar.user.domain.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private final SecretKey key;
    private final long minutes;
    public JwtService(@Value("${univmar.security.jwt-secret}") String secret, @Value("${univmar.security.access-token-minutes}") long minutes) {
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) throw new IllegalStateException("JWT secret must be at least 32 bytes");
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); this.minutes = minutes;
    }
    public String create(User user) {
        Instant now = Instant.now();
        return Jwts.builder().subject(String.valueOf(user.getId())).claim("email", user.getEmail()).claim("role", user.getRole().name())
                .issuedAt(Date.from(now)).expiration(Date.from(now.plus(minutes, ChronoUnit.MINUTES))).signWith(key).compact();
    }
    public Long userId(String token) { return Long.valueOf(Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject()); }
    public long expiresInSeconds() { return minutes * 60; }
}
