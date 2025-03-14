package com.backend.dto.httpSecurityDto.RequestDto;

import com.backend.internal.DTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@DTO
public class RequestProcessResetPassword {

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&_\\-/])[A-Za-z\\d@$!%*?&_\\-/]{8,}$")
    @Size(min = 8, max = 20)
    @NotBlank
    private String newPassword;

        public RequestProcessResetPassword() {}

    public RequestProcessResetPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
