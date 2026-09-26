package com.univmar.auth;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.univmar.common.api.ApiException;
import com.univmar.user.domain.Role;
import com.univmar.user.domain.User;
import com.univmar.user.domain.UserRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class AccessControlServiceTest {
    @Mock private UserRepository users;
    @Mock private Environment environment;

    @AfterEach
    void clearAuthentication() { SecurityContextHolder.clearContext(); }

    @Test
    void salesAgentCannotChangeAnotherAgentsQuotation() {
        User user = new User("sara@univmar.test", "hash", Role.SALES_AGENT);
        when(users.findById(user.getId())).thenReturn(Optional.of(user));
        signInAs(user, Role.SALES_AGENT);

        assertThatThrownBy(() -> new AccessControlService(users).requireSalesOwnership("other@univmar.test", "quotation"))
            .isInstanceOf(ApiException.class)
            .extracting(error -> ((ApiException) error).getStatus())
            .isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void salesAgentCanChangeOwnQuotation() {
        User user = new User("sara@univmar.test", "hash", Role.SALES_AGENT);
        when(users.findById(user.getId())).thenReturn(Optional.of(user));
        signInAs(user, Role.SALES_AGENT);

        assertThatCode(() -> new AccessControlService(users).requireSalesOwnership("sara@univmar.test", "quotation"))
            .doesNotThrowAnyException();
    }

    @Test
    void productionRefusesTheBuiltInDevelopmentJwtSecret() {
        when(environment.getActiveProfiles()).thenReturn(new String[]{"production"});

        assertThatThrownBy(() -> new JwtService("change-this-development-secret-to-a-32-byte-minimum-value", 30, environment))
            .isInstanceOf(IllegalStateException.class)
            .hasMessage("UNIVMAR_JWT_SECRET must be explicitly configured in production.");
    }

    private void signInAs(User user, Role role) {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
            user.getId().toString(), null, List.of(new SimpleGrantedAuthority("ROLE_" + role.name()))));
    }
}
