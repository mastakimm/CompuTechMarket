package com.backend.dto.httpSecurityDto.RequestDto;

import com.backend.internal.DTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@DTO
public class RequestResendOtp {
    @NotBlank
    @Email
    private String email;

    public RequestResendOtp() {
    }

    // Parameterized constructor
    public RequestResendOtp(String email) {
        this.email = email;
    }

    public @NotBlank @Email String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank @Email String email) {
        this.email = email;
    }
}
