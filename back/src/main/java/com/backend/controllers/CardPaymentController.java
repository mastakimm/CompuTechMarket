package com.backend.controllers;

import com.backend.dto.payment.AnonymousPaymentResponse;
import com.backend.dto.payment.CardPaymentDto;
import com.backend.dto.payment.CardPaymentRequest;
import com.backend.entities.CardPayment;
import com.backend.internal.PublicEndpoint;
import com.backend.services.CardPaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/card-payments")
public class CardPaymentController {

    private final CardPaymentService cardPaymentService;

    @Autowired
    public CardPaymentController(CardPaymentService cardPaymentService) {
        this.cardPaymentService = cardPaymentService;
    }

    @PublicEndpoint
    @PostMapping("/add")
    public ResponseEntity<CardPayment> addCardPayment(@RequestBody CardPaymentRequest request) {
        CardPayment cardPayment = cardPaymentService.addCardPayment(
                request.getCustomerId(),
                request.getStripeCardId(),
                request.getCvv(),
                request.getIsActive()
        );
        return ResponseEntity.ok(cardPayment);
    }

    @PublicEndpoint
    @GetMapping("/card-info/{customerId}")
    public ResponseEntity<List<CardPaymentDto>> getCardInformationByUserId(@PathVariable Long customerId) {
        List<CardPaymentDto> cardPayments = cardPaymentService.getCardPaymentsByCustomerId(customerId);
        if (cardPayments.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cardPayments);
    }

    @PutMapping("/set-active")
    public ResponseEntity<Void> setActiveCard(
            @RequestParam Long customerId,
            @RequestParam String stripeCardId) {
        cardPaymentService.setActiveCard(customerId, stripeCardId);
        return ResponseEntity.ok().build();
    }

    @PublicEndpoint
    @PostMapping("/anonymous-payment")
    public ResponseEntity<?> handleAnonymousPayment(
            @RequestParam String stripeToken,
            @RequestParam String email) {
        try {
            AnonymousPaymentResponse response = cardPaymentService.handleAnonymousPayment(stripeToken, email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to add payment method: " + e.getMessage());
        }
    }
}
