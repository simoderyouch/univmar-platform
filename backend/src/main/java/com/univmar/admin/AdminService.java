package com.univmar.admin;

import com.univmar.admin.api.AdminDtos;
import com.univmar.audit.AuditService;
import com.univmar.audit.domain.AuditEventRepository;
import com.univmar.shared.api.ApiException;
import com.univmar.user.domain.User;
import com.univmar.user.domain.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {
    private final UserRepository users;
    private final AuditEventRepository events;
    private final PasswordEncoder passwords;
    private final AuditService audit;

    public AdminService(UserRepository users, AuditEventRepository events, PasswordEncoder passwords, AuditService audit) {
        this.users = users;
        this.events = events;
        this.passwords = passwords;
        this.audit = audit;
    }

    @Transactional(readOnly = true)
    public List<AdminDtos.UserResponse> users() {
        return users.findAll().stream().map(this::user).toList();
    }

    @Transactional
    public AdminDtos.UserResponse createUser(AdminDtos.CreateUser input, Long actorId) {
        String email = input.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email))
            throw ApiException.conflict("EMAIL_ALREADY_EXISTS", "An account already uses this email");
        User created = users.save(new User(email, passwords.encode(input.password()), input.role()));
        audit.record(actorId, "USER_CREATED", "USER", created.getId(), "Administrative account created");
        return user(created);
    }

    @Transactional
    public AdminDtos.UserResponse updateUser(Long id, AdminDtos.UserUpdate input, Long actorId) {
        User user = users.findById(id).orElseThrow(() -> ApiException.notFound("User"));
        user.changeRole(input.role());
        if (input.status() != null) user.updateStatus(input.status());
        else if (Boolean.TRUE.equals(input.active())) user.enable();
        else if (Boolean.FALSE.equals(input.active())) user.disable();
        else throw ApiException.conflict("VALIDATION_ERROR", "Provide active or status when updating an account");
        audit.record(actorId, "USER_UPDATED", "USER", user.getId(), "Administrative account updated");
        return user(user);
    }

    @Transactional
    public void resetPassword(Long id, AdminDtos.ResetPassword input, Long actorId) {
        User user = users.findById(id).orElseThrow(() -> ApiException.notFound("User"));
        user.changePassword(passwords.encode(input.password()));
        audit.record(actorId, "USER_PASSWORD_RESET", "USER", user.getId(), "Password reset by administrator");
    }

    @Transactional(readOnly = true)
    public List<AdminDtos.AuditResponse> audit(String type, Long id) {
        return events.findTop100ByEntityTypeAndEntityIdOrderByCreatedAtDesc(type, id).stream().map(x -> new AdminDtos.AuditResponse(x.getId(), x.getActorId(), x.getAction(), x.getEntityType(), x.getEntityId(), x.getDetail(), x.getCreatedAt(), x.getDetailsJson())).toList();
    }

    private AdminDtos.UserResponse user(User x) {
        return new AdminDtos.UserResponse(x.getId(), x.getEmail(), x.getRole().name(), x.getStatus().name(), x.getCreatedAt());
    }
}
