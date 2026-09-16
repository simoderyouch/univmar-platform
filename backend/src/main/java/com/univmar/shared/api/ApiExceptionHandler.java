package com.univmar.shared.api;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.net.URI;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    ProblemDetail api(ApiException e, HttpServletRequest request) {
        return problem(e.status(), e.code(), e.getMessage(), request);
    }

    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class})
    ProblemDetail validation(Exception e, HttpServletRequest request) {
        Map<String, String> fields = new LinkedHashMap<>();
        if (e instanceof MethodArgumentNotValidException x)
            x.getBindingResult().getFieldErrors().forEach(error -> fields.put(error.getField(), error.getDefaultMessage()));
        if (e instanceof BindException x)
            x.getBindingResult().getFieldErrors().forEach(error -> fields.put(error.getField(), error.getDefaultMessage()));
        ProblemDetail detail = problem(HttpStatus.BAD_REQUEST, ErrorCode.VALIDATION_ERROR, "One or more fields are invalid", request);
        detail.setProperty("fields", fields);
        return detail;
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ProblemDetail unreadable(HttpServletRequest request) {
        return problem(HttpStatus.BAD_REQUEST, ErrorCode.INVALID_REQUEST_BODY, "Request body is missing or contains invalid JSON", request);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    ProblemDetail typeMismatch(MethodArgumentTypeMismatchException e, HttpServletRequest request) {
        ProblemDetail detail = problem(HttpStatus.BAD_REQUEST, ErrorCode.INVALID_PARAMETER, "A URL parameter has an invalid value", request);
        detail.setProperty("parameter", e.getName());
        return detail;
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    ProblemDetail oversized(HttpServletRequest request) {
        return problem(HttpStatus.PAYLOAD_TOO_LARGE, ErrorCode.PAYLOAD_TOO_LARGE, "Uploaded file exceeds the permitted size", request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    ProblemDetail access(HttpServletRequest request) {
        return problem(HttpStatus.FORBIDDEN, ErrorCode.ACCESS_DENIED, "You are not allowed to access this resource", request);
    }

    @ExceptionHandler({DataIntegrityViolationException.class, OptimisticLockingFailureException.class})
    ProblemDetail concurrent(HttpServletRequest request) {
        return problem(HttpStatus.CONFLICT, ErrorCode.CONCURRENT_MODIFICATION, "The request conflicts with current business data; reload and retry", request);
    }

    @ExceptionHandler(Exception.class)
    ProblemDetail unknown(Exception e, HttpServletRequest request) {
        String id = requestId(request);
        log.error("Unhandled API error; requestId={}", id, e);
        return problem(HttpStatus.INTERNAL_SERVER_ERROR, ErrorCode.INTERNAL_ERROR, "An unexpected error occurred. Contact support with the request ID.", request);
    }

    private ProblemDetail problem(HttpStatus status, ErrorCode code, String message, HttpServletRequest request) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(status, message);
        detail.setTitle(code.name());
        detail.setType(URI.create("https://univmar.local/problems/" + code.name().toLowerCase()));
        detail.setProperty("code", code.name());
        detail.setProperty("timestamp", Instant.now());
        detail.setProperty("path", request.getRequestURI());
        detail.setProperty("requestId", requestId(request));
        return detail;
    }

    private String requestId(HttpServletRequest request) {
        Object value = request.getAttribute(RequestIdFilter.ATTRIBUTE);
        return value == null ? "unknown" : value.toString();
    }
}
