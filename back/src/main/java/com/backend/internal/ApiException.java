package com.backend.internal;

import org.springframework.http.HttpStatusCode;
import java.util.Map;

public class ApiException extends RuntimeException {
    private final ErrorCode code;
    private final Map<String, String> metadata;
    private final HttpStatusCode status;

    public ApiException(ErrorCode code, Map<String, String> metadata, HttpStatusCode status) {
        super(code.name());
        this.code = code;
        this.metadata = metadata;
        this.status = status;
    }

    public ErrorCode getCode() {
        return code;
    }

    public Map<String, String> getMetadata() {
        return metadata;
    }

    public HttpStatusCode getStatus() {
        return status;
    }
}
