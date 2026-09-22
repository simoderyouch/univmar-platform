package com.univmar.audit.api;

import java.time.Instant;
import java.util.UUID;

public final class AuditDtos { private AuditDtos() { } public record Response(UUID id, String eventType, String message, String actor, Instant occurredAt) { } }
