package com.backend.config;

import com.backend.internal.PublicEndpoint;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class PublicEndpointsCollector implements InitializingBean {

    private final ApplicationContext context;
    private final RequestMappingHandlerMapping requestMappingHandlerMapping;

    private final List<String> publicEndpoints = new ArrayList<>();

    public PublicEndpointsCollector(ApplicationContext context, RequestMappingHandlerMapping requestMappingHandlerMapping) {
        this.context = context;
        this.requestMappingHandlerMapping = requestMappingHandlerMapping;
    }

    public List<String> getPublicEndpoints() {
        return publicEndpoints;
    }

    @Override
    public void afterPropertiesSet() {
        Map<RequestMappingInfo, HandlerMethod> handlerMethods = requestMappingHandlerMapping.getHandlerMethods();

        for (Map.Entry<RequestMappingInfo, HandlerMethod> entry : handlerMethods.entrySet()) {
            HandlerMethod handlerMethod = entry.getValue();
            Method method = handlerMethod.getMethod();
            Class<?> controllerClass = method.getDeclaringClass();

            // Check if the method or its declaring class is annotated with @PublicEndpoint
            if (method.isAnnotationPresent(PublicEndpoint.class) || controllerClass.isAnnotationPresent(PublicEndpoint.class)) {
                Set<String> mappings = entry.getKey().getPatternValues();
                publicEndpoints.addAll(mappings);
            }
        }
    }
}
