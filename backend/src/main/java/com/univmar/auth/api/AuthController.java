package com.univmar.auth.api;

import com.univmar.auth.AuthService;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController @RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService service;
    public AuthController(AuthService service) { this.service = service; }
    @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED) public AuthDtos.TokenResponse register(@Valid @RequestBody AuthDtos.RegisterRequest request) { return service.register(request); }
    @PostMapping("/login") public AuthDtos.TokenResponse login(@Valid @RequestBody AuthDtos.LoginRequest request) { return service.login(request); }
    @PostMapping("/refresh") public AuthDtos.TokenResponse refresh(@Valid @RequestBody AuthDtos.RefreshRequest request) { return service.refresh(request.refreshToken()); }
    @PostMapping("/logout") @ResponseStatus(HttpStatus.NO_CONTENT) public void logout(@Valid @RequestBody AuthDtos.RefreshRequest request) { service.logout(request.refreshToken()); }
}
