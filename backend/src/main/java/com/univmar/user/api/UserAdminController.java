package com.univmar.user.api;

import static com.univmar.common.api.ApiResponse.of;

import com.univmar.common.api.ApiResponse;
import com.univmar.common.api.RequestIdFilter;
import com.univmar.user.UserAdministrationService;
import com.univmar.user.api.UserAdminDtos.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserAdminController {
    private final UserAdministrationService users;
    public UserAdminController(UserAdministrationService users) { this.users = users; }

    @GetMapping public ApiResponse<List<Response>> list(HttpServletRequest request) { return of(users.list(), requestId(request)); }
    @PostMapping public ResponseEntity<ApiResponse<Response>> create(@Valid @RequestBody CreateInput input, HttpServletRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(of(users.create(input), requestId(request))); }
    @PatchMapping("/{id}/role") public ApiResponse<Response> changeRole(@PathVariable UUID id, @Valid @RequestBody RoleInput input, HttpServletRequest request) { return of(users.changeRole(id, input), requestId(request)); }
    @PatchMapping("/{id}/active") public ApiResponse<Response> changeActive(@PathVariable UUID id, @RequestBody ActiveInput input, HttpServletRequest request) { return of(users.changeActive(id, input), requestId(request)); }
    @PatchMapping("/{id}/password") public ApiResponse<Response> resetPassword(@PathVariable UUID id, @Valid @RequestBody ResetPasswordInput input, HttpServletRequest request) { return of(users.resetPassword(id, input), requestId(request)); }
    private String requestId(HttpServletRequest request) { return (String) request.getAttribute(RequestIdFilter.REQUEST_ID_ATTRIBUTE); }
}
