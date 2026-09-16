package com.univmar.auth;

import com.univmar.auth.api.AuthDtos;
import com.univmar.auth.domain.RefreshToken;
import com.univmar.auth.domain.RefreshTokenRepository;
import com.univmar.customer.domain.CustomerProfile;
import com.univmar.customer.domain.CustomerProfileRepository;
import com.univmar.customer.domain.CustomerType;
import com.univmar.shared.api.ApiException;
import com.univmar.shared.api.ErrorCode;
import com.univmar.user.domain.AccountStatus;
import com.univmar.user.domain.Role;
import com.univmar.user.domain.User;
import com.univmar.user.domain.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

@Service
public class AuthService {
    private final UserRepository users;
    private final CustomerProfileRepository profiles;
    private final RefreshTokenRepository refreshTokens;
    private final PasswordEncoder passwords;
    private final JwtService jwt;
    private final SecureRandom random = new SecureRandom();

    public AuthService(UserRepository users, CustomerProfileRepository profiles, RefreshTokenRepository refreshTokens, PasswordEncoder passwords, JwtService jwt) {
        this.users = users;
        this.profiles = profiles;
        this.refreshTokens = refreshTokens;
        this.passwords = passwords;
        this.jwt = jwt;
    }

    @Transactional
    public AuthDtos.TokenResponse register(AuthDtos.RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email))
            throw ApiException.conflict(ErrorCode.EMAIL_ALREADY_EXISTS, "An account already uses this email");
        if (request.customerType() == CustomerType.PROFESSIONAL && (request.companyName() == null || request.companyName().isBlank()))
            throw ApiException.badRequest(ErrorCode.VALIDATION_ERROR, "companyName is required for a professional customer");
        User user = users.save(new User(email, passwords.encode(request.password()), Role.CUSTOMER));
        profiles.save(new CustomerProfile(user, request.customerType(), request.firstName().trim(), request.lastName().trim(), trimToNull(request.companyName()), trimToNull(request.phone())));
        return issue(user);
    }

    @Transactional
    public AuthDtos.TokenResponse login(AuthDtos.LoginRequest request) {
        User user = users.findByEmailIgnoreCase(request.email().trim()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, ErrorCode.INVALID_CREDENTIALS, "Email or password is invalid"));
        if (user.getStatus() != AccountStatus.ACTIVE || !passwords.matches(request.password(), user.getPasswordHash()))
            throw new ApiException(HttpStatus.UNAUTHORIZED, ErrorCode.INVALID_CREDENTIALS, "Email or password is invalid");
        return issue(user);
    }

    @Transactional
    public AuthDtos.TokenResponse refresh(String token) {
        RefreshToken refresh = refreshTokens.findByTokenHash(hash(token)).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, ErrorCode.INVALID_REFRESH_TOKEN, "Refresh token is invalid"));
        if (!refresh.isUsable() || refresh.getUser().getStatus() != AccountStatus.ACTIVE)
            throw new ApiException(HttpStatus.UNAUTHORIZED, ErrorCode.INVALID_REFRESH_TOKEN, "Refresh token is expired or revoked");
        refresh.revoke();
        return issue(refresh.getUser());
    }

    @Transactional
    public void logout(String token) {
        refreshTokens.findByTokenHash(hash(token)).ifPresent(RefreshToken::revoke);
    }

    private AuthDtos.TokenResponse issue(User user) {
        byte[] bytes = new byte[48];
        random.nextBytes(bytes);
        String refresh = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        refreshTokens.save(new RefreshToken(user, hash(refresh), Instant.now().plus(30, ChronoUnit.DAYS)));
        return new AuthDtos.TokenResponse(jwt.create(user), refresh, "Bearer", jwt.expiresInSeconds());
    }

    private String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private String hash(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(digest);
        } catch (java.security.NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }
}
