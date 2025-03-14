package com.backend.dto.deliveryFee;

import com.backend.enums.DeliveryMethod;
import com.backend.enums.DeliverySpeed;
import com.backend.internal.DTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@DTO
@Getter
@Setter
public class CountryWithDeliveryFeesDTO {
    private Long id;
    private String name;
    private List<DeliveryFeeDTO> deliveryFees;
    private List<PaymentMethodDTO> paymentMethods;

    public CountryWithDeliveryFeesDTO() {}

    public CountryWithDeliveryFeesDTO(Long id, String name, List<DeliveryFeeDTO> deliveryFees, List<PaymentMethodDTO> paymentMethods) {
        this.id = id;
        this.name = name;
        this.deliveryFees = deliveryFees;
        this.paymentMethods = paymentMethods;
    }

    @Getter
    @Setter
    public static class DeliveryFeeDTO {
        private DeliveryMethod deliveryMethod;
        private DeliverySpeed deliverySpeed;
        private String feePercentage;

        public DeliveryFeeDTO() {}

        public DeliveryFeeDTO(DeliveryMethod deliveryMethod, DeliverySpeed deliverySpeed, String feePercentage) {
            this.deliveryMethod = deliveryMethod;
            this.deliverySpeed = deliverySpeed;
            this.feePercentage = feePercentage;
        }
    }

    @Getter
    @Setter
    public static class PaymentMethodDTO {
        private Long id;
        private String name;

        public PaymentMethodDTO() {}

        public PaymentMethodDTO(Long id, String name) {
            this.id = id;
            this.name = name;
        }
    }
}
