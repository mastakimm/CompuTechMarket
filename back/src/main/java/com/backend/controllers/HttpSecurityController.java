package com.backend.controllers;

/*import com.backend.config.CloudflareCaptcha;
import com.backend.config.CloudflareVerify;*/

import com.backend.dto.httpSecurityDto.RequestDto.*;
import com.backend.entities.Customer;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;
import com.backend.internal.PublicEndpoint;
import com.backend.repositories.CustomerRepository;
import com.backend.services.CustomerService;
import com.backend.services.HttpSecurityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication Management")
public class HttpSecurityController {

    @Autowired
    private HttpSecurityService httpSecurityService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerRepository customerRepository;

    /*
        @CloudflareVerify
    */
    @Operation(summary = "Register a User", description = "User can create an account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully registered & confirmation email sent"),
            @ApiResponse(responseCode = "400", description = "Validation failed", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "409", description = "Conflict, Email already token", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json"))
    })
    @PublicEndpoint
    @PostMapping("/register")
    public void register(@Valid @RequestBody RequestRegister request) {
        httpSecurityService.registerUser(request);
    }


    @Operation(summary = "Verify the OTP", description = "Verify otp sent is registration confirmation mail")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully validated the account of the customer"),
            @ApiResponse(responseCode = "400", description = "Invalid Token", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "400", description = "Expired Token", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Email already verified", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json"))
    })
    @PublicEndpoint
    @PostMapping("/verify-otp")
    public void verifyOtp(@RequestParam String email, @RequestParam String otp, HttpServletResponse response) {
        httpSecurityService.verifyOtp(email, otp, response);
    }


    @Operation(summary = "Resends the OTP", description = "Resends otp for mail confirmation")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully resent the OTP to the customer"),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json"))
    })
    @PublicEndpoint
    @PostMapping("/resend-otp")
    public void resendOtp(@Valid @RequestBody RequestResendOtp request) {
        httpSecurityService.resendOtp(request.getEmail());
    }

    @Operation(summary = "Forgotten password", description = "Send a mail to reset the customer password's")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully sent the reset password mail"),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json"))
    })
    @PublicEndpoint
    @PostMapping("/reset-password")
    public void resetPassword(@Valid @RequestBody RequestForgotPassword requestForgotPassword) {
        httpSecurityService.resetPassword(requestForgotPassword.getEmail());
    }

    @Operation(summary = "Validate the resetPasswordToken", description = "Process the reset Password Token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully reset the customer password"),
            @ApiResponse(responseCode = "400", description = "Invalid Token", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "400", description = "Expired Token", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "404", description = "User not found", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json"))
    })
    @PublicEndpoint
    @PostMapping("/process-reset-password")
    public void processPasswordReset(@RequestParam String token, @Valid @RequestBody RequestProcessResetPassword requestProcessResetPassword) {
        httpSecurityService.processPasswordReset(token, requestProcessResetPassword.getNewPassword());
    }

/*
    @CloudflareVerify
*/
    @Operation(summary = "Authenticate the customer", description = "Authenticate the Customer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully authenticate the customer"),
            @ApiResponse(responseCode = "403", description = "Bad credentials", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json"))
    })
    @PublicEndpoint
    @PostMapping("/login")
    public void login(@Valid @RequestBody RequestLogin request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        if (!authentication.isAuthenticated()) {
            Api.Error(ErrorCode.BAD_CREDENTIALS);
        }

        Customer customer = customerRepository.findByEmail(request.getEmail());
        if (!customer.getVerified()) {
            Api.Error(ErrorCode.EMAIL_NOT_VERIFIED);
        }

        httpSecurityService.generateTokenAndAssignCookie(request.getEmail(), response);
        customerService.updateLastConnectionDate(request.getEmail());
    }


                                    /*      HERE        */
    @Operation(summary = "Logout the Customer", description = "Invalidate the jwt of the customer and log him out")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully invalidate JWT set in cookie"),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json"))
    })
    @PostMapping("/logout")
    public void logout(HttpServletResponse response) {
        httpSecurityService.invalidateCookie(response);
    }


    @Operation(summary = "Kill the customer session's", description = "Kill the Customer session")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully killed the Customer session's"),
            @ApiResponse(responseCode = "500", description = "Internal server error ", content = @Content(mediaType = "application/json"))
    })
    @PostMapping("/kill")
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public void killWebSessions(HttpServletResponse response) {
        customerService.killWebSessions(response);
    }
}
