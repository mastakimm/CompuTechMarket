package com.backend.dto.deliveryFee;

import com.backend.enums.DeliveryMethod;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateDeliveryFeeByMethodDTO {
    private DeliveryMethod deliveryMethod;
    private String feePercentage;
}
