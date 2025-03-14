package com.backend.services;

import com.backend.entities.PasswordResetToken;
import com.backend.entities.Token;
import com.backend.internal.Api;
import com.backend.internal.ApiException;
import com.backend.internal.ErrorCode;
import com.backend.dto.httpSecurityDto.RequestDto.RequestRegister;
import com.backend.entities.Customer;
import com.backend.entities.CustomerRole;
import com.backend.repositories.CustomerRepository;
import com.backend.repositories.PasswordResetTokenRepository;
import com.backend.repositories.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.mail.MailException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.logging.Logger;

@Service
public class HttpSecurityService implements UserDetailsService {
    private static final Logger LOGGER = Logger.getLogger(HttpSecurityService.class.getName());

    @Value("${jwt.cookie.expires_in_days}")
    private Number cookieExpiry;

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.cookie.name}")
    private String cookieName;

    @Value("${urls.production.main}")
    private String cookieDomain;

    @Value("${jwt.cookie.shared_session_expiration}")
    private String cookieExpirationName;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder bcrypt;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private CustomerService customerService;

    public void generateTokenAndAssignCookie(String username, HttpServletResponse response) {
        String accessToken = generateToken(username);
        Duration cookieDuration = Duration.ofDays(cookieExpiry.longValue());

        setResponseCookie(cookieName, accessToken, cookieDuration, response);

        String expirationTime = Long.toString(new Date().getTime() + cookieDuration.toMillis());
        setResponseCookie(cookieExpirationName, expirationTime, cookieDuration, response, false);
    }

    public void invalidateCookie(HttpServletResponse response) {
        setResponseCookie(cookieName, "", Duration.ZERO, response);
        setResponseCookie(cookieExpirationName, "", Duration.ZERO, response);
    }

    public void setResponseCookie(String name, String value, Duration duration, HttpServletResponse response, boolean httpOnly) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(httpOnly)
                .secure(false)
                .path("/")
                //.domain("." + cookieDomain)
                .sameSite("Lax")
                .maxAge(duration)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void setResponseCookie(String name, String value, Duration duration, HttpServletResponse response) {
        setResponseCookie(name, value, duration, response, true);
    }

    public <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Claims validateToken(String token, UserDetails userDetails) {
        Claims claims = extractAllClaims(token);
        String username = claims.getSubject();
        Date creationDate = claims.getIssuedAt();
        Date expirationDate = claims.getExpiration();
        Date accountInvalidateTime = ((CustomUserDetails) userDetails).getJwtInvalidateDate();

        // username mismatch
        if (!username.equals(userDetails.getUsername())) {
            return null;
        }

        // expiration
        if (expirationDate.before(new Date())) {
            return null;
        }

        // token revoke
        if (accountInvalidateTime != null && creationDate.before(accountInvalidateTime)) {
            return null;
        }

        return claims;
    }

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String username) {
        Date expiryDate = new Date(System.currentTimeMillis() + cookieExpiry.longValue() * 3600L * 24L * 1000L);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(expiryDate)
                .signWith(getSignKey())
                .compact();
    }

    private SecretKey getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        Customer user = customerRepository.findByEmail(username);
        if (user == null) {
            Api.Error(ErrorCode.BAD_CREDENTIALS);
        }

        return new CustomUserDetails(user.getEmail(), user.getPassword(), user.getRoles(), user.getJwtInvalidationDate());
    }

    public void registerUser(RequestRegister request) {
        try {
            // Check if the email already exists
            if (customerRepository.findByEmail(request.getEmail()) != null) {
                Api.Error(ErrorCode.EMAIL_ALREADY_EXISTS);
            }

            // Encode the password
            String password = bcrypt.encode(request.getPassword());
            Customer user = customerRepository.save(new Customer(request.getEmail(), password, request.getDisplayName()));

            // Generate OTP and save it to the database
            String otp = generateRandomOtp();
            LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(15);
            Token token = new Token();
            token.setOtp(otp);
            token.setCustomer(user);
            token.setExpirationTime(expirationTime);
            tokenRepository.save(token);

            // Send email with OTP
            String to = request.getEmail();
            String subject = "Email validation";
            String text = "Your OTP is: " + otp;
            emailService.sendSimpleMessage(to, subject, text);
        } catch (ApiException e) {
            LOGGER.severe("API Exception during user registration: " + e.getMessage());
            throw e;
        } catch (DataIntegrityViolationException e) {
            LOGGER.severe("Data Integrity Violation during user registration: " + e.getMessage());
            Api.Error(ErrorCode.DATA_INTEGRITY_VIOLATION);
        } catch (MailException e) {
            LOGGER.severe("Mail sending failure during user registration: " + e.getMessage());
            Api.Error(ErrorCode.MAIL_SENDING_FAILED);
        } catch (Exception e) {
            LOGGER.severe("Unexpected error during user registration: " + e.getMessage());
            Api.Error(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }


    public void verifyOtp(String email, String otp, HttpServletResponse response) {

        // Check if the customer exists
        Customer customer = customerRepository.findByEmail(email);
        if (customer == null) {
            Api.Error(ErrorCode.USER_NOT_FOUND);
        }

        if (customer.getVerified()) {
            Api.Error(ErrorCode.EMAIL_ALREADY_VERIFIED);
        }

        // Look for the Customer that the token has been generated for
        Token token = tokenRepository.findByCustomerAndOtp(customer, otp);
        if (token == null) {
            Api.Error(ErrorCode.INVALID_TOKEN);
        }

        // Check if the OTP has expired
        if (token.getExpirationTime().isBefore(LocalDateTime.now())) {
            Api.Error(ErrorCode.EXPIRED_TOKEN);
        }

        // If everything is valid, set is_verified (mail confirmation) to true
        // and delete the row with the otp
        tokenRepository.delete(token);

        customer.setVerified(true);
        customerRepository.save(customer);

        if (!customer.getVerified()) {
            Api.Error(ErrorCode.EMAIL_NOT_VERIFIED);
        }

        // Generate JWT token and set it in the response cookie
        generateTokenAndAssignCookie(customer.getEmail(), response);
        customerService.updateLastConnectionDate(email);
    }

    @Transactional
    public void resendOtp(String email) {
        try {

            // Check if the customer exists
            Customer customer = customerRepository.findByEmail(email);
            if (customer == null) {
                Api.Error(ErrorCode.USER_NOT_FOUND);
            }

            boolean is_verified = customer.getVerified();
            if (is_verified) {
                Api.Error(ErrorCode.EMAIL_ALREADY_VERIFIED);
            }

            tokenRepository.deleteByCustomer(customer);

            // Generate a new OTP
            String otp = generateRandomOtp();
            LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(15);

            Token token = new Token();
            token.setOtp(otp);
            token.setCustomer(customer);
            token.setExpirationTime(expirationTime);
            tokenRepository.save(token);

            // Send the OTP via email
            String subject = "Email validation";
            String text = "Your new OTP is: " + otp;
            emailService.sendSimpleMessage(email, subject, text);
        } catch (ApiException e) {
            LOGGER.severe("Error during resending Otp: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            LOGGER.severe("Error during resending Otp: " + e.getMessage());
            Api.Error(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    public static class CustomUserDetails extends User {
        private final Date jwtInvalidateDate;

        public CustomUserDetails(String email, String password, List<CustomerRole> authorities, Date jwtInvalidateDate) {
            super(email, password, authorities.stream().map(role -> new SimpleGrantedAuthority(role.getName().toUpperCase())).toList());
            this.jwtInvalidateDate = jwtInvalidateDate;
        }

        public Date getJwtInvalidateDate() {
            return jwtInvalidateDate;
        }
    }

    @Transactional
    public void resetPassword(String email) {
        try {
            Customer customer = customerRepository.findByEmail(email);
            if (customer == null) {
                Api.Error(ErrorCode.USER_NOT_FOUND);
            }

            // Invalidate existing tokens
            passwordResetTokenRepository.deleteByCustomer(customer);

            // Generate a new reset token
            String resetToken = generateRandomToken();
            LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(15);

            PasswordResetToken passwordResetToken = new PasswordResetToken();
            passwordResetToken.setToken(resetToken);
            passwordResetToken.setCustomer(customer);
            passwordResetToken.setExpirationTime(expirationTime);
            passwordResetTokenRepository.save(passwordResetToken);

            // Send email with the reset link
            String subject = "Password Reset Request";

            /*      */

            String resetLink = "http://localhost:4200/reset-password?token=" + resetToken;
            String text = "Click the following link to reset your password: " + resetLink;
            emailService.sendSimpleMessage(email, subject, text);
            LOGGER.info("Email sent to: " + email);
        } catch (ApiException e) {
            LOGGER.severe("Error during password reset: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            LOGGER.severe("Error during password reset: " + e.getMessage());
            Api.Error(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    public void processPasswordReset(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token);
        if (resetToken == null) {
            Api.Error(ErrorCode.INVALID_TOKEN);
        }

        if (resetToken.getExpirationTime().isBefore(LocalDateTime.now())) {
            Api.Error(ErrorCode.EXPIRED_TOKEN);
        }

        Customer customer = resetToken.getCustomer();

        if (customer == null) {
            Api.Error(ErrorCode.USER_NOT_FOUND);
        }

        customer.setPassword(bcrypt.encode(newPassword));
        customerRepository.save(customer);

        // Invalidate the used token
        passwordResetTokenRepository.delete(resetToken);

        LOGGER.info("Password has been reset for customer: " + customer.getEmail());
    }

    // Generate the token for reset Password mail
    // token = 20 bytes token.
    private String generateRandomToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[20];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    // Generate the otp for the registration confirmation mail
    // otp = Random 4 digits code
    public String generateRandomOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder(4);
        for (int i = 0; i < 4; i++) {
            otp.append((char) ('0' + random.nextInt(10)));
        }

        return otp.toString();
    }
}
