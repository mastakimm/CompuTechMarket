package com.backend.config;

import com.backend.internal.ApiException;
import com.backend.internal.Context;
import com.backend.internal.ErrorCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.Map;
import java.util.HashMap;

@ControllerAdvice
public class ErrorHandler {

    public static class ErrorResponseDTO {
        private final ErrorCode code;
        private final long timestamp;
        private final Map<String, String> metadata;

        public ErrorResponseDTO(ErrorCode code, long timestamp) {
            this.code = code;
            this.timestamp = timestamp;
            this.metadata = new HashMap<>();
        }

        public ErrorResponseDTO(ErrorCode code, long timestamp, Map<String, String> metadata) {
            this.code = code;
            this.timestamp = timestamp;
            this.metadata = metadata;
        }

        public ErrorCode getCode() {
            return code;
        }

        public long getTimestamp() {
            return timestamp;
        }

        public Map<String, String> getMetadata() {
            return metadata;
        }
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponseDTO> handleApiException(ApiException ex, WebRequest request) {
        ErrorResponseDTO errorResponse = new ErrorResponseDTO(ex.getCode(), System.currentTimeMillis(), ex.getMetadata());
        return new ResponseEntity<>(errorResponse, ex.getStatus());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        ex.printStackTrace();
        ErrorResponseDTO errorResponse = new ErrorResponseDTO(ErrorCode.BAD_CREDENTIALS, System.currentTimeMillis());
        return new ResponseEntity<>(errorResponse, errorResponse.getCode().getStatus());
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleAccessDenied(NoResourceFoundException ex, WebRequest request) {
        ErrorResponseDTO errorResponse = new ErrorResponseDTO(ErrorCode.INVALID_ENDPOINT, System.currentTimeMillis());
        Context.logError(ex, Context.request().getRequestURI());
        return new ResponseEntity<>(errorResponse, errorResponse.getCode().getStatus());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponseDTO> handleResourceException(AccessDeniedException ex, WebRequest request) {
        ErrorResponseDTO errorResponse = new ErrorResponseDTO(ErrorCode.AUTHENTICATION_REQUIRED, System.currentTimeMillis());
        return new ResponseEntity<>(errorResponse, errorResponse.getCode().getStatus());
    }

    @ExceptionHandler(InternalAuthenticationServiceException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadCredentialsException(InternalAuthenticationServiceException ex, WebRequest request) {
        ErrorResponseDTO errorResponse = new ErrorResponseDTO(ErrorCode.BAD_CREDENTIALS, System.currentTimeMillis());
        return new ResponseEntity<>(errorResponse, errorResponse.getCode().getStatus());
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponseDTO> handleRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex, WebRequest request) {
        ErrorResponseDTO errorResponse = new ErrorResponseDTO(ErrorCode.METHOD_NOT_ALLOWED, System.currentTimeMillis());
        Context.logError(ex, Context.request().getRequestURI());
        return new ResponseEntity<>(errorResponse, errorResponse.getCode().getStatus());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleInternalErrors(Exception ex, WebRequest request) {
        ex.printStackTrace();
        ErrorResponseDTO errorResponse = new ErrorResponseDTO(ErrorCode.INTERNAL_SERVER_ERROR, System.currentTimeMillis());
        Context.logError(ex, Context.request().getRequestURI());
        return new ResponseEntity<>(errorResponse, errorResponse.getCode().getStatus());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> validations = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            validations.put(fieldName, errorMessage);
        });

        Context.logError(ex, Context.request().getRequestURI());

        ErrorResponseDTO response = new ErrorResponseDTO(ErrorCode.VALIDATION_FAILED, System.currentTimeMillis(), validations);
        return new ResponseEntity<>(response, response.getCode().getStatus());
    }
}
