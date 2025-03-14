package com.backend.internal;

import org.springframework.http.HttpStatusCode;
import java.util.HashMap;
import java.util.Map;

public class Api {

    public static void Error(ErrorCode message,
                             String logErrorOrTrace,
                             HttpStatusCode status,
                             Map<String, String> metadata,
                             MetadataInitializer init) throws ApiException {
        if (init != null) {
            init.initialize(metadata);
        }
        if (logErrorOrTrace != null) {
            Context.logError(logErrorOrTrace);
        }
        throw new ApiException(message, metadata, status);
    }

    // Overloaded method to handle the simple case with just an ErrorCode and a default status
    public static void Error(ErrorCode message) throws ApiException {
        Error(message, null, message.getStatus(), new HashMap<>(), null);
    }

    // Overloaded method to include logging information
    public static void Error(ErrorCode message, String logErrorOrTrace) throws ApiException {
        Error(message, logErrorOrTrace, message.getStatus(), new HashMap<>(), null);
    }

    // Overloaded method to specify HttpStatus and log information without metadata or initializer
    public static void Error(ErrorCode message, String logErrorOrTrace, HttpStatusCode status) throws ApiException {
        Error(message, logErrorOrTrace, status, new HashMap<>(), null);
    }

    // Overloaded method to specify HttpStatus and metadata without initializer
    public static void Error(ErrorCode message, String logErrorOrTrace, HttpStatusCode status, Map<String, String> metadata) throws ApiException {
        Error(message, logErrorOrTrace, status, metadata, null);
    }

    // Interface for initializing metadata
    public interface MetadataInitializer {
        void initialize(Map<String, String> metadata);
    }
}
