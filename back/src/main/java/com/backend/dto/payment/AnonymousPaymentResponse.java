package com.backend.dto.payment;

public class AnonymousPaymentResponse {
    private String paymentMethodId;
    private String customerId;

    public AnonymousPaymentResponse(String paymentMethodId, String customerId) {
        this.paymentMethodId = paymentMethodId;
        this.customerId = customerId;
    }

    public String getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(String paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }
}
