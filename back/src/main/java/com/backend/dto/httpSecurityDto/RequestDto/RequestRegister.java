package com.backend.dto.httpSecurityDto.RequestDto;

import com.backend.internal.DTO;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@DTO
public class RequestRegister {

    @NotBlank
    @Email
    private String email;

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&_\\-/])[A-Za-z\\d@$!%*?&_\\-/]{8,}$")
    @Size(min = 8, max = 20)
    @NotBlank
    private String password;

    @NotBlank
    @Size(min = 3, max = 10)
    @Pattern(regexp = "^[a-zA-Z0-9\\-_]+$")
    private String displayName;

    // Default constructor
    public RequestRegister() {
    }

    // Parameterized constructor
    public RequestRegister(String email, String password, String displayName) {
        this.email = email;
        this.password = password;
        this.displayName = displayName;
    }


    public @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&_\\-/])[A-Za-z\\d@$!%*?&_\\-/]{8,}$") @Size(min = 8, max = 20) @NotBlank String getPassword() {
        return password;
    }

    public void setPassword(@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&_\\-/])[A-Za-z\\d@$!%*?&_\\-/]{8,}$") @Size(min = 8, max = 20) @NotBlank String password) {
        this.password = password;
    }

    public @NotBlank @Size(min = 3, max = 10) @Pattern(regexp = "^[a-zA-Z0-9\\-_]+$") String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(@NotBlank @Size(min = 3, max = 10) @Pattern(regexp = "^[a-zA-Z0-9\\-_]+$") String displayName) {
        this.displayName = displayName;
    }

    public @NotBlank @Email String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank @Email String email) {
        this.email = email;
    }
}
