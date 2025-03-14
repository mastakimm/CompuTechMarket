package com.backend.dto.httpSecurityDto.RequestDto;

import com.backend.internal.DTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@DTO
public class RequestPasswordChange {

    @NotBlank
    private String oldPassword;

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&_\\-/])[A-Za-z\\d@$!%*?&_\\-/]{8,}$")
    @Size(min = 8, max = 20)
    @NotBlank
    private String newPassword;

    public RequestPasswordChange() {}

    public RequestPasswordChange(String oldPassword, String newPassword) {
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
