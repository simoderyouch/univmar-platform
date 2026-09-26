package com.univmar.auth;

import com.univmar.common.api.ApiException;
import com.univmar.user.domain.UserRepository;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AccessControlService {
    private final UserRepository users;

    public AccessControlService(UserRepository users) { this.users = users; }

    public String currentUserEmail() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) return "System";
        try {
            return users.findById(UUID.fromString(authentication.getName())).map(user -> user.getEmail()).orElse(authentication.getName());
        } catch (IllegalArgumentException ignored) {
            return authentication.getName();
        }
    }

    public UUID currentUserId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        try { return authentication == null ? null : UUID.fromString(authentication.getName()); }
        catch (Exception ignored) { return null; }
    }

    public boolean hasRole(String role) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getAuthorities().stream().anyMatch(authority -> ("ROLE_" + role).equals(authority.getAuthority()));
    }

    public boolean isSalesAgent() { return hasRole("SALES_AGENT"); }
    public boolean isManagerOrAdmin() { return hasRole("ADMIN") || hasRole("MANAGER"); }

    public void requireSalesOwnership(String ownerEmail, String recordName) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean salesAgent = authentication != null && authentication.getAuthorities().stream()
            .anyMatch(authority -> "ROLE_SALES_AGENT".equals(authority.getAuthority()));
        if (salesAgent && !currentUserEmail().equalsIgnoreCase(ownerEmail)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "RECORD_ACCESS_DENIED", "Sales agents can only change their own " + recordName + ".");
        }
    }
}
