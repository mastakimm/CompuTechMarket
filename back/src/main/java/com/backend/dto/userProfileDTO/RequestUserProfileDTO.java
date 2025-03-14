package com.backend.dto.userProfileDTO;

import com.backend.internal.DTO;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@DTO
@Getter
@Setter
@AllArgsConstructor
public class RequestUserProfileDTO {

    @NotNull
    @NotEmpty
    private String address;

    @NotNull
    @NotEmpty
    private String billing_address;

    @NotNull
    @NotEmpty
    private String country;

    @NotNull
    @NotEmpty
    private String phone_number;

    @NotNull
    @NotEmpty
    private String zipcode;

    @NotNull
    @NotEmpty
    private String city;

    @NotNull
    @NotEmpty
    private String firstname;

    @NotNull
    @NotEmpty
    private String lastname;

    @NotNull
    private Boolean isActive;
}
