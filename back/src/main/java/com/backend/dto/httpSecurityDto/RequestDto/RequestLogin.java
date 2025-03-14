package com.backend.dto.httpSecurityDto.RequestDto;

import com.backend.internal.DTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@DTO
public class RequestLogin {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    // Default constructor
    public RequestLogin() {
    }

    // Parameterized constructor
    public RequestLogin(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
