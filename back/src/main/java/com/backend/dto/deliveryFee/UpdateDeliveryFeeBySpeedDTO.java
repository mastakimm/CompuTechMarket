package com.backend.dto.deliveryFee;

import com.backend.enums.DeliverySpeed;
import com.backend.internal.DTO;
import lombok.Getter;

@DTO
@Getter
public class UpdateDeliveryFeeBySpeedDTO {
    private DeliverySpeed deliverySpeed;
    private String feePercentage;
}
