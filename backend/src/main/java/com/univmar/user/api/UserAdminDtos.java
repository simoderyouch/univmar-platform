package com.univmar.user.api;

import com.univmar.user.domain.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

public final class UserAdminDtos {
    private UserAdminDtos() { }

    public record CreateInput(@NotBlank @Email String email, @NotBlank @Size(min = 12, max = 128) String password, @NotNull Role role) { }
    public record RoleInput(@NotNull Role role) { }
    public record ActiveInput(boolean active) { }
    public record ResetPasswordInput(@NotBlank @Size(min = 12, max = 128) String password) { }
    public record Response(UUID id, String email, Role role, boolean active, Instant createdAt, Instant updatedAt) { }
}
