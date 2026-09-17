package com.univmar.auth;

import com.univmar.user.domain.Role;
import com.univmar.user.domain.User;
import com.univmar.user.domain.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
class InitialAdminBootstrap {

    @Bean
    CommandLineRunner createInitialAdmin(UserRepository users, PasswordEncoder encoder,
            @Value("${univmar.bootstrap-admin.email:}") String email,
            @Value("${univmar.bootstrap-admin.password:}") String password) {
        return args -> {
            if (!email.isBlank() && !password.isBlank() && users.findByEmailIgnoreCase(email).isEmpty()) {
                users.save(new User(email.trim().toLowerCase(), encoder.encode(password), Role.ADMIN));
            }
        };
    }
}
