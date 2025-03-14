package com.backend.dto.historic;

import com.backend.dto.customerDto.SimpleCustomerDto;
import com.backend.dto.ResponseProductDto;
import com.backend.internal.DTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@DTO
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HistoricOrderResponseDto {

    private Long id;
    private int quantity;
    private Date orderDate;
    private String deliveryId;
    private String orderId;
    private SimpleCustomerDto customer;
    private ResponseProductDto product;
    private Long productId;
    private String stripeChargeId;
    private Long adresseId;
    private String tva;
}