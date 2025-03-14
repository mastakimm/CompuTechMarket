package com.backend.config;

import com.backend.internal.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class HttpSecurity {

    @Autowired
    @Lazy
    private com.backend.services.HttpSecurityService httpSecurityService;

    private final List<String> swaggerEndpoints = List.of("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html");

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(org.springframework.security.config.annotation.web.builders.HttpSecurity http, JwtAuthFilter jwtAuthFilter, PublicEndpointsCollector endpointsCollector) throws Exception {
        List<String> publicEndpoints = new ArrayList<>(endpointsCollector.getPublicEndpoints());
        publicEndpoints.addAll(swaggerEndpoints);

        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(publicEndpoints.toArray(new String[0])).permitAll();
                    //auth.requestMatchers("/images/**").permitAll();
                    auth.anyRequest().authenticated();
                })
                .exceptionHandling(exceptions -> {
                    exceptions.accessDeniedHandler((request, response, accessDeniedException) -> unauthorizedHandler(response));
                    exceptions.authenticationEntryPoint((request, response, authException) -> unauthorizedHandler(response));
                })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> {
                    logout.logoutUrl("/auth/logout")
                            .addLogoutHandler(logoutHandler())
                            .logoutSuccessHandler((request, response, authentication) -> response.setStatus(HttpServletResponse.SC_OK));
                })
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(httpSecurityService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    private void unauthorizedHandler(HttpServletResponse response) {
        try {
            ErrorHandler.ErrorResponseDTO errorResponse = new ErrorHandler.ErrorResponseDTO(ErrorCode.AUTHENTICATION_REQUIRED, System.currentTimeMillis());
            response.setStatus(errorResponse.getCode().getStatus().value());
            response.setHeader("Content-Type", "application/json");
            response.getWriter().write(new ObjectMapper().writeValueAsString(errorResponse));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Bean
    public LogoutHandler logoutHandler() {
        return (request, response, authentication) -> httpSecurityService.invalidateCookie(response);
    }
}
