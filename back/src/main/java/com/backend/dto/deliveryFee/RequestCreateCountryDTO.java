package com.backend.dto.deliveryFee;

import com.backend.internal.DTO;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.stereotype.Service;

@DTO
@Service
@Getter
public class RequestCreateCountryDTO {

    @NotEmpty
    @NotNull
    private String countryName;
}
