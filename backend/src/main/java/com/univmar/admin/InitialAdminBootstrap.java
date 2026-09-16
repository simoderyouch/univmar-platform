package com.univmar.admin;

import com.univmar.user.domain.Role;
import com.univmar.user.domain.User;
import com.univmar.user.domain.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Creates an administrator only when both one-time bootstrap variables are supplied. */
@Configuration
class InitialAdminBootstrap {
    @Bean
    ApplicationRunner initialAdmin(
            UserRepository users,
            PasswordEncoder passwords,
            @Value("${univmar.bootstrap-admin.email:}") String email,
            @Value("${univmar.bootstrap-admin.password:}") String password) {
        return ignored -> {
            String normalized = email.trim().toLowerCase();
            if (!normalized.isEmpty() && !password.isBlank() && !users.existsByEmailIgnoreCase(normalized)) {
                users.save(new User(normalized, passwords.encode(password), Role.ADMIN));
            }
        };
    }
}
