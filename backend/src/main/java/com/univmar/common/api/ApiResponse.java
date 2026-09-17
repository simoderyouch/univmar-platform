package com.univmar.common.api;

import java.time.Instant;

/** The envelope used by every successful JSON API response. */
public record ApiResponse<T>(T data, Instant timestamp, String requestId) {
    public static <T> ApiResponse<T> of(T data, String requestId) {
        return new ApiResponse<>(data, Instant.now(), requestId);
    }
}
