package com.backend.dto.httpSecurityDto.RequestDto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public class RequestForgotPassword {

    @Email
    @NotEmpty
    private String email;

    public @Email @NotEmpty String getEmail() {
        return email;
    }

    public void setEmail(@Email @NotEmpty String email) {
        this.email = email;
    }
}
