package com.univmar.admin.api;

import com.univmar.user.domain.Role;
import com.univmar.user.domain.AccountStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public final class AdminDtos {
    private AdminDtos() {
    }

    public record UserResponse(Long id, String email, String role, String status, Instant createdAt) {
    }

    public record UserUpdate(@NotNull Role role, Boolean active, AccountStatus status) {
    }

    public record CreateUser(@Email @NotBlank String email, @NotBlank @Size(min = 10, max = 100) String password,
                             @NotNull Role role) {
    }

    public record ResetPassword(@NotBlank @Size(min = 10, max = 100) String password) {
    }

    public record AuditResponse(Long id, Long actorId, String action, String entityType, Long entityId, String detail,
                                Instant createdAt, String detailsJson) {
    }
}
