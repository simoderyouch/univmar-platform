package com.univmar.shared.api;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {
    private final HttpStatus status;
    private final ErrorCode code;

    public ApiException(HttpStatus status, ErrorCode code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }

    /**
     * Compatibility overload for existing business services; new code should pass ErrorCode.
     */
    public ApiException(HttpStatus status, String code, String message) {
        this(status, ErrorCode.fromLegacy(code), message);
    }

    public static ApiException notFound(String resource) {
        return new ApiException(HttpStatus.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND, resource + " was not found");
    }

    public static ApiException forbidden() {
        return new ApiException(HttpStatus.FORBIDDEN, ErrorCode.ACCESS_DENIED, "You are not allowed to access this resource");
    }

    public static ApiException badRequest(ErrorCode code, String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, code, message);
    }

    public static ApiException conflict(ErrorCode code, String message) {
        return new ApiException(HttpStatus.CONFLICT, code, message);
    }

    /**
     * Compatibility overload while older services are migrated to ErrorCode.
     */
    public static ApiException conflict(String code, String message) {
        return conflict(ErrorCode.fromLegacy(code), message);
    }

    public HttpStatus status() {
        return status;
    }

    public ErrorCode code() {
        return code;
    }
}
