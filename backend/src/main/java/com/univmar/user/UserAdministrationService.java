package com.univmar.user;

import com.univmar.audit.AuditService;
import com.univmar.common.api.ApiException;
import com.univmar.document.domain.DocumentTargetType;
import com.univmar.user.api.UserAdminDtos.*;
import com.univmar.user.domain.Role;
import com.univmar.user.domain.User;
import com.univmar.user.domain.UserRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserAdministrationService {
    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final AuditService audit;

    public UserAdministrationService(UserRepository users, PasswordEncoder passwordEncoder, AuditService audit) { this.users = users; this.passwordEncoder = passwordEncoder; this.audit = audit; }

    @Transactional(readOnly = true)
    public List<Response> list() { return users.findAll().stream().sorted(Comparator.comparing(User::getEmail)).map(this::response).toList(); }

    public Response create(CreateInput input) {
        String email = input.email().trim().toLowerCase(Locale.ROOT);
        if (users.findByEmailIgnoreCase(email).isPresent()) throw conflict("USER_EMAIL_EXISTS", "A user already exists with this email address.");
        User user = users.save(new User(email, passwordEncoder.encode(input.password()), input.role()));
        audit.record(DocumentTargetType.USER, user.getId(), "USER_CREATED", "Created user with role " + input.role().name());
        return response(user);
    }

    public Response changeRole(UUID id, RoleInput input) {
        User user = entity(id);
        preventSelfChange(user);
        preventRemovingLastAdmin(user, user.isActive() && input.role() != Role.ADMIN);
        Role previous = user.getRole();
        user.changeRole(input.role());
        audit.record(DocumentTargetType.USER, user.getId(), "USER_ROLE_CHANGED", "Changed role from " + previous.name() + " to " + input.role().name());
        return response(user);
    }

    public Response changeActive(UUID id, ActiveInput input) {
        User user = entity(id);
        preventSelfChange(user);
        preventRemovingLastAdmin(user, !input.active());
        user.changeActive(input.active());
        audit.record(DocumentTargetType.USER, user.getId(), input.active() ? "USER_ACTIVATED" : "USER_DEACTIVATED", input.active() ? "Activated user access" : "Deactivated user access");
        return response(user);
    }

    public Response resetPassword(UUID id, ResetPasswordInput input) {
        User user = entity(id);
        user.resetPassword(passwordEncoder.encode(input.password()));
        audit.record(DocumentTargetType.USER, user.getId(), "USER_PASSWORD_RESET", "Administrator reset this staff account's password and invalidated active sessions");
        return response(user);
    }

    private User entity(UUID id) { return users.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User was not found.")); }
    private void preventSelfChange(User user) { if (user.getId().equals(currentUserId())) throw conflict("SELF_ACCESS_CHANGE_NOT_ALLOWED", "You cannot change your own role or access status."); }
    private void preventRemovingLastAdmin(User user, boolean removesAdminAccess) { if (removesAdminAccess && user.getRole() == Role.ADMIN && users.countByRoleAndActiveTrue(Role.ADMIN) <= 1) throw conflict("LAST_ADMIN_REQUIRED", "At least one active administrator must remain."); }
    private UUID currentUserId() { try { return UUID.fromString(SecurityContextHolder.getContext().getAuthentication().getName()); } catch (Exception ignored) { return null; } }
    private Response response(User user) { return new Response(user.getId(), user.getEmail(), user.getRole(), user.isActive(), user.getCreatedAt(), user.getUpdatedAt()); }
    private ApiException conflict(String code, String message) { return new ApiException(HttpStatus.CONFLICT, code, message); }
}
