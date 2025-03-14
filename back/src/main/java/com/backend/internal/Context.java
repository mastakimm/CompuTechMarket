package com.backend.internal;

import com.backend.config.ErrorHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

public class Context {

    public static final String CF_IP_HEADER = "X-CF-Real-IP";
    public static final String NGINX_IP_HEADER = "X-Real-IP";

    public static final Logger logger = LoggerFactory.getLogger(ErrorHandler.class);

    public static Authentication auth() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public static String currentUserEmail() {
        return auth().getName();
    }

    public static HttpServletRequest request() {
        return ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
    }

/*    public static String ip() {
        HttpServletRequest request = request();
        String ip = request.getHeader(CF_IP_HEADER);
        if (ip != null) {
            return ip;
        }
        ip = request.getHeader(NGINX_IP_HEADER);
        if (ip != null) {
            return ip;
        }
        throw new IllegalStateException("No IP header found");
    }*/

    public static void logError(String err) {
        logger.error(err);
    }

    public static void logError(Exception exception, String msg) {
        String traces = exceptionToString(exception);
        logError(msg + " " + traces);
    }

    private static String exceptionToString(Exception exception) {
        return java.util.Arrays.stream(exception.getStackTrace())
                .filter(element -> element.getClassName().contains(".backend"))
                .map(StackTraceElement::toString)
                .reduce((acc, element) -> acc + "\n" + element)
                .orElse("");
    }
}
