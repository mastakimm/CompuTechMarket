package com.backend.dto.component;

import com.backend.internal.DTO;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@DTO
public class RequestUpdateComponent {

    @NotNull(message = "Quantity cannot be null")
    private Integer quantity;
}
