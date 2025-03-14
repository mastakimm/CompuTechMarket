package com.backend.services;

import com.backend.dto.payment.AnonymousPaymentResponse;
import com.backend.dto.payment.CardPaymentDto;
import com.backend.entities.CardPayment;
import com.backend.entities.Customer;
import com.backend.repositories.CardPaymentRepository;
import com.backend.repositories.CustomerRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentMethod;
import com.stripe.param.PaymentMethodAttachParams;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CardPaymentService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CardPaymentRepository cardPaymentRepository;

    @Value("${stripe.api.secret}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    public CardPayment addCardPayment(Long customerId, String stripeToken, String cvv, Boolean isActive) {
        Optional<Customer> customerOptional = customerRepository.findById(customerId);
        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            String stripeCustomerId = customer.getStripeCustomerId();

            if (stripeCustomerId == null || stripeCustomerId.isEmpty()) {
                com.stripe.model.Customer stripeCustomer = createStripeCustomer(customer);
                stripeCustomerId = stripeCustomer.getId();
                customer.setStripeCustomerId(stripeCustomerId);
                customerRepository.save(customer);
            }

            // Créer un PaymentMethod à partir du token
            PaymentMethod paymentMethod = createPaymentMethodFromToken(stripeToken);

            attachPaymentMethodToCustomer(stripeCustomerId, paymentMethod.getId());

            PaymentMethod.Card cardDetails = paymentMethod.getCard();

            if (Boolean.TRUE.equals(isActive)) {
                List<CardPayment> existingCards = cardPaymentRepository.findByCustomerId(customerId);
                for (CardPayment card : existingCards) {
                    card.setIsActive(false);
                    cardPaymentRepository.save(card);
                }
            }

            CardPayment cardPayment = new CardPayment();
            cardPayment.setCustomer(customer);
            cardPayment.setStripeCardId(paymentMethod.getId());
            cardPayment.setCvv(cvv);
            cardPayment.setIsActive(isActive);
            if (cardDetails != null) {
                cardPayment.setCardBrand(cardDetails.getBrand());
                cardPayment.setLast4(cardDetails.getLast4());
            }
            return cardPaymentRepository.save(cardPayment);

        } else {
            Api.Error(ErrorCode.CUSTOMER_NOT_FOUND);
            throw new RuntimeException("Customer not found");
        }
    }

    private PaymentMethod createPaymentMethodFromToken(String stripeToken) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("type", "card");
            params.put("card", Map.of("token", stripeToken));

            return PaymentMethod.create(params);
        } catch (StripeException e) {
            Api.Error(ErrorCode.ERROR_CREATE_METHODE_PAYMENT);
            throw new RuntimeException("Failed to create PaymentMethod from token", e);
        }
    }

    private void attachPaymentMethodToCustomer(String stripeCustomerId, String paymentMethodId) {
        try {
            PaymentMethodAttachParams attachParams =
                    PaymentMethodAttachParams.builder()
                            .setCustomer(stripeCustomerId)
                            .build();

            PaymentMethod paymentMethod = PaymentMethod.retrieve(paymentMethodId);
            paymentMethod.attach(attachParams);
        } catch (StripeException e) {
            Api.Error(ErrorCode.ERROR_CREATE_METHODE_PAYMENT);
            throw new RuntimeException("Failed to attach PaymentMethod to Stripe customer", e);
        }
    }

    private com.stripe.model.Customer createStripeCustomer(Customer customer) {
        try {
            com.stripe.param.CustomerCreateParams params = com.stripe.param.CustomerCreateParams.builder()
                    .setEmail(customer.getEmail())
                    .build();

            return com.stripe.model.Customer.create(params);
        } catch (StripeException e) {
            Api.Error(ErrorCode.ERROR_CREATE_METHODE_PAYMENT);
            throw new RuntimeException("Failed to create Stripe customer", e);
        }
    }


    public List<CardPaymentDto> getCardPaymentsByCustomerId(Long customerId) {
        try {
            List<CardPayment> cardPayments = cardPaymentRepository.findByCustomerId(customerId);
            return cardPayments.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        }catch (Exception e) {
            Api.Error(ErrorCode.ERROR_GET_METHODE_PAYMENT);
            throw new RuntimeException("Failed to get Card payments", e);
        }
    }

    @Transactional
    public void setActiveCard(Long customerId, String stripeCardId) {
        List<CardPayment> customerCards = cardPaymentRepository.findByCustomerId(customerId);
        for (CardPayment card : customerCards) {
            if (card.getStripeCardId().equals(stripeCardId)) {
                card.setIsActive(true);
            } else {
                card.setIsActive(false);
            }
            cardPaymentRepository.save(card);
        }
    }
    private void createPaymentIntent(String customerId, String paymentMethodId, int amount) throws StripeException {
        Map<String, Object> paymentIntentParams = new HashMap<>();
        paymentIntentParams.put("amount", amount);
        paymentIntentParams.put("currency", "usd");
        paymentIntentParams.put("customer", customerId);
        paymentIntentParams.put("payment_method", paymentMethodId);
        paymentIntentParams.put("confirm", true);

        com.stripe.model.PaymentIntent.create(paymentIntentParams);
    }

    public AnonymousPaymentResponse handleAnonymousPayment(String stripeToken, String email) {
        try {
            com.stripe.param.CustomerCreateParams customerParams = com.stripe.param.CustomerCreateParams.builder()
                    .setEmail(email)
                    .build();
            com.stripe.model.Customer stripeCustomer = com.stripe.model.Customer.create(customerParams);

            PaymentMethod paymentMethod = createPaymentMethodFromToken(stripeToken);

            attachPaymentMethodToCustomer(stripeCustomer.getId(), paymentMethod.getId());

            return new AnonymousPaymentResponse(paymentMethod.getId(), stripeCustomer.getId());
        } catch (StripeException e) {
            throw new RuntimeException("Failed to process anonymous payment", e);
        }
    }

    private CardPaymentDto convertToDto(CardPayment cardPayment) {
        CardPaymentDto dto = new CardPaymentDto();
        dto.setId(cardPayment.getId());
        dto.setStripeCardId(cardPayment.getStripeCardId());
        dto.setCardBrand(cardPayment.getCardBrand());
        dto.setLast4(cardPayment.getLast4());
        dto.setCvv(cardPayment.getCvv());
        dto.setIsActive(cardPayment.getIsActive());
        return dto;
    }
}

