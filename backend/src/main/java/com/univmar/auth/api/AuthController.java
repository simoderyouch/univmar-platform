package com.univmar.auth.api;

import com.univmar.auth.JwtService;
import com.univmar.common.api.ApiException;
import com.univmar.common.api.ApiResponse;
import com.univmar.common.api.RequestIdFilter;
import com.univmar.user.domain.User;
import com.univmar.user.domain.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt) { this.users = users; this.encoder = encoder; this.jwt = jwt; }

    @PostMapping("/login")
    ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest input, HttpServletRequest request) {
        User user = users.findByEmailIgnoreCase(input.email().trim()).filter(User::isActive)
            .filter(candidate -> encoder.matches(input.password(), candidate.getPasswordHash()))
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "Email or password is incorrect."));
        return ApiResponse.of(new LoginResponse(jwt.createAccessToken(user), UserResponse.from(user)), requestId(request));
    }

    @GetMapping("/me")
    ApiResponse<UserResponse> me(Authentication authentication, HttpServletRequest request) {
        User user = users.findById(java.util.UUID.fromString(authentication.getName()))
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "UNAUTHENTICATED", "Authentication is required."));
        return ApiResponse.of(UserResponse.from(user), requestId(request));
    }

    private String requestId(HttpServletRequest request) { return (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE); }

    public record LoginRequest(@NotBlank @Email String email, @NotBlank @Size(min = 8, max = 128) String password) { }
    public record LoginResponse(String accessToken, UserResponse user) { }
    public record UserResponse(String id, String email, String role) {
        static UserResponse from(User user) { return new UserResponse(user.getId().toString(), user.getEmail(), user.getRole().name()); }
    }
}
