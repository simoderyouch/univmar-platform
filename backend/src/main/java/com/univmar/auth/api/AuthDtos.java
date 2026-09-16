package com.univmar.auth.api;

import com.univmar.customer.domain.CustomerType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record RegisterRequest(@Email @NotBlank String email, @NotBlank @Size(min = 10, max = 100) String password,
                                  @NotNull CustomerType customerType, @NotBlank @Size(max = 100) String firstName,
                                  @NotBlank @Size(max = 100) String lastName, @Size(max = 180) String companyName,
                                  @Size(max = 50) String phone) {
    }

    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {
    }

    public record RefreshRequest(@NotBlank String refreshToken) {
    }

    public record TokenResponse(String accessToken, String refreshToken, String tokenType, long expiresInSeconds) {
    }
}
