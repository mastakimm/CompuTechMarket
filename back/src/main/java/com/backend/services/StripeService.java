
package com.backend.services;

import com.backend.repositories.HistoricRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;


@Service
public class StripeService {

    private final HistoricRepository historicRepository;
    @Value("${stripe.api.secret}")
    private String stripeApiSecret;

    public StripeService(HistoricRepository historicRepository) {
        this.historicRepository = historicRepository;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiSecret;
        System.out.println("Clé API Stripe initialisée : " + stripeApiSecret);
    }

    public Charge createCharge(int amount, String currency, String paymentMethodId, String description, String stripeCustomerId) throws StripeException {
        PaymentIntentCreateParams createParams = PaymentIntentCreateParams.builder()
                .setAmount((long) amount)
                .setCurrency(currency)
                .setPaymentMethod(paymentMethodId)
                .setCustomer(stripeCustomerId)
                .setConfirm(true)
                .setDescription(description)
                .build();

        PaymentIntent intent = PaymentIntent.create(createParams);

        if (intent.getStatus().equals("succeeded")) {
            return intent.getCharges().getData().get(0);
        } else {
            throw new RuntimeException("Payment did not succeed");
        }
    }

    public Charge createAnonymousCharge(int amount, String currency, String paymentMethodId, String description, String customerId) throws StripeException {
        PaymentIntentCreateParams.Builder createParamsBuilder = PaymentIntentCreateParams.builder()
                .setAmount((long) amount)
                .setCurrency(currency)
                .setPaymentMethod(paymentMethodId)
                .setConfirm(true)
                .setDescription(description);

        if (customerId != null && !customerId.isEmpty()) {
            createParamsBuilder.setCustomer(customerId);
        }

        PaymentIntentCreateParams createParams = createParamsBuilder.build();

        PaymentIntent intent = PaymentIntent.create(createParams);

        if (intent.getStatus().equals("succeeded")) {
            return intent.getCharges().getData().get(0);
        } else {
            throw new RuntimeException("Payment did not succeed");
        }
    }


}

