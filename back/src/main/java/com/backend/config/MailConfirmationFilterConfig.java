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

import java.io.IOException;

@Configuration
public class MailConfirmationFilterConfig {

    @Autowired
    private CustomerRepository customerRepository;

    @Bean
    public FilterRegistrationBean<MailConfirmationFilter> mailConfirmationFilter() {
        FilterRegistrationBean<MailConfirmationFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new MailConfirmationFilter(customerRepository));

        // Add URL patterns to apply the filter only to specific endpoints
        registrationBean.addUrlPatterns("/gay/*");

        return registrationBean;
    }

    public static class MailConfirmationFilter implements Filter {

        private final CustomerRepository customerRepository;

        public MailConfirmationFilter(CustomerRepository customerRepository) {
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
                if (currentCustomer != null && currentCustomer.getVerified()) {
                    chain.doFilter(request, response);
                } else {
                    httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User is not verified");
                }
            } else {
                httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User is not authenticated");
            }
        }
    }
}
