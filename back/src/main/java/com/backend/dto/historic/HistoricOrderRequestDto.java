package com.backend.dto.historic;

import com.backend.internal.DTO;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@DTO
@Getter
@Setter
public class HistoricOrderRequestDto {

    @NotNull
    private int quantity;
    private Date orderDate;

    @NotEmpty
    private String deliveryId;

    @NotEmpty
    private String orderId;

    @NotNull
    private Long customerId;

    @NotNull
    private Long productId;

    @NotEmpty
    private String stripeChargeId;

    @NotNull
    private Long adresseId;

    @NotEmpty
    private String tva;

}