package com.backend.dto.stock;

import com.backend.internal.DTO;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@DTO
public class StockDto {

    @NotNull
    @NotEmpty
    private String supplier;

    @NotNull
    private Integer quantity;

    @NotNull
    private BigDecimal purchasePrice;

    @NotNull
    private BigDecimal sellingPrice;

    private Date refillDate = new Date();

    @NotNull
    private Long productId;
}
