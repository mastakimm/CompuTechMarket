package com.backend.runners;

import com.backend.services.DeliveryFeeService;
import com.backend.services.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ApplicationStartupRunner implements CommandLineRunner {

    @Autowired
    private DeliveryFeeService deliveryFeeService;

    @Autowired
    private PaymentMethodService paymentMethodService;

    @Override
    public void run(String... args) {

        deliveryFeeService.initializeDeliveryFeesForAllCountries();
        paymentMethodService.initializePaymentMethodsForCountries();
    }

}
