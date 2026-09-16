package com.univmar.admin.api;

import com.univmar.admin.AdminService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    @GetMapping("/users")
    public List<AdminDtos.UserResponse> users() {
        return service.users();
    }

    @PostMapping("/users")
    @ResponseStatus(org.springframework.http.HttpStatus.CREATED)
    public AdminDtos.UserResponse create(@Valid @RequestBody AdminDtos.CreateUser input) {
        return service.createUser(input);
    }

    @PatchMapping("/users/{id}")
    public AdminDtos.UserResponse update(@PathVariable Long id, @Valid @RequestBody AdminDtos.UserUpdate input) {
        return service.updateUser(id, input);
    }

    @PostMapping("/users/{id}/reset-password")
    @ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT)
    public void resetPassword(@PathVariable Long id, @Valid @RequestBody AdminDtos.ResetPassword input) {
        service.resetPassword(id, input);
    }

    @GetMapping("/audit/{entityType}/{entityId}")
    public List<AdminDtos.AuditResponse> audit(@PathVariable String entityType, @PathVariable Long entityId) {
        return service.audit(entityType, entityId);
    }
}
