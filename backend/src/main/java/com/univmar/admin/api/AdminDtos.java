package com.univmar.admin.api;
import com.univmar.user.domain.Role; import jakarta.validation.constraints.NotNull; import java.time.Instant;
public final class AdminDtos {private AdminDtos(){} public record UserResponse(Long id,String email,String role,String status,Instant createdAt){} public record UserUpdate(@NotNull Role role,@NotNull Boolean active){} public record AuditResponse(Long id,Long actorId,String action,String entityType,Long entityId,String detail,Instant createdAt){}}
