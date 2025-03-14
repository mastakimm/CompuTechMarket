package com.backend.config;

import com.backend.entities.Customer;
import com.backend.internal.Context;
import com.backend.repositories.CustomerRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.io.IOException;

@Configuration
public class AdminFilter {

    @Autowired
    private CustomerRepository customerRepository;

    @Bean
    public FilterRegistrationBean<RoleFilter> roleFilter() {
        FilterRegistrationBean<RoleFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new RoleFilter(customerRepository));

        // Add URL patterns to apply the filter only to specific endpoints
        registrationBean.addUrlPatterns("/users/*");

        return registrationBean;
    }

    public static class RoleFilter implements Filter {

        private final CustomerRepository customerRepository;

        public RoleFilter(CustomerRepository customerRepository) {
            this.customerRepository = customerRepository;
        }

        @Override
        public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
                throws IOException, ServletException {

            HttpServletResponse httpResponse = (HttpServletResponse) response;

            Authentication authentication = Context.auth();
            System.out.println(authentication + " Authenticated Customer");

            if (authentication != null && authentication.isAuthenticated()) {
                Customer currentCustomer = customerRepository.findByEmail(Context.currentUserEmail());
                if (currentCustomer != null && hasRequiredRole(authentication)) {
                    chain.doFilter(request, response);
                } else {
                    httpResponse.sendError(HttpServletResponse.SC_FORBIDDEN, "User does not have the required role");
                }
            } else {
                httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User is not authenticated");
            }
        }

        private boolean hasRequiredRole(Authentication authentication) {
            for (GrantedAuthority authority : authentication.getAuthorities()) {
                if (authority.getAuthority().equals("ROLE_ADMIN")) {
                    return true;
                }
            }
            return false;
        }
    }
}
