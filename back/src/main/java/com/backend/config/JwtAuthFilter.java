package com.backend.config;

import com.backend.services.HttpSecurityService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private HttpSecurityService httpSecurityService;

    @Autowired
    private HttpSecurityService jwtService;

    @Autowired
    private UserDetailsService userDetailsServiceImpl;

    @Value("${jwt.cookie.refresh-strategy.after_days}")
    private Number cookieRefreshTimeThreshold;

    @Value("${jwt.cookie.name}")
    private String cookieName;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws java.io.IOException, jakarta.servlet.ServletException {
        var cookies = request.getCookies();
        if (cookies == null) {
            filterChain.doFilter(request, response);
            return;
        }

        var cookie = java.util.Arrays.stream(cookies).filter(c -> c.getName().equals(cookieName)).findFirst().orElse(null);
        if (cookie == null) {
            filterChain.doFilter(request, response);
            return;
        }

        var username = jwtService.extractClaim(cookie.getValue(), Claims::getSubject);
        if (username == null) {
            invalidateCookieAndProceed(response, filterChain, request);
            return;
        }

        var user = loadUserByUsernameOrNull(username);
        if (user == null) {
            invalidateCookieAndProceed(response, filterChain, request);
            return;
        }

        var claims = jwtService.validateToken(cookie.getValue(), user);
        if (claims != null) {
            var authenticationToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            var elapsedTimeSinceCreation = new Date().getTime() - claims.getIssuedAt().getTime();

            if (elapsedTimeSinceCreation > TimeUnit.DAYS.toMillis(cookieRefreshTimeThreshold.longValue())) {
                httpSecurityService.generateTokenAndAssignCookie(user.getUsername(), response);
            }
        } else {
            invalidateCookieAndProceed(response, filterChain, request);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void invalidateCookieAndProceed(HttpServletResponse response, FilterChain filterChain, HttpServletRequest request) throws java.io.IOException, jakarta.servlet.ServletException {
        httpSecurityService.invalidateCookie(response);
        filterChain.doFilter(request, response);
    }

    private org.springframework.security.core.userdetails.UserDetails loadUserByUsernameOrNull(String username) {
        try {
            return userDetailsServiceImpl.loadUserByUsername(username);
        } catch (Exception e) {
            return null;
        }
    }
}
