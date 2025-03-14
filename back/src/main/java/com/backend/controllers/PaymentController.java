package com.backend.controllers;

import com.backend.dto.ResponseProductDto;
import com.backend.entities.Customer;
import com.backend.entities.HistoricOrder;
import com.backend.entities.Product;
import com.backend.internal.PublicEndpoint;
import com.backend.services.CustomerService;
import com.backend.services.OrderService;
import com.backend.services.ProductService;
import com.backend.services.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final StripeService stripeService;
    private final OrderService orderService;
    private final CustomerService customerService;
    private final ProductService productService;

    @Autowired
    public PaymentController(StripeService stripeService, OrderService orderService,
                             CustomerService customerService, ProductService productService) {
        this.stripeService = stripeService;
        this.orderService = orderService;
        this.customerService = customerService;
        this.productService = productService;
    }

    @PublicEndpoint
    @PostMapping("/charge")
    public String charge(@RequestParam int amount, @RequestParam String currency, @RequestParam String paymentMethodId,
                         @RequestParam Long customerId) {
        try {
            Optional<Customer> customerOptional = customerService.getCustomerById(customerId);
          //  Optional<ResponseProductDto> productOptional = productService.getById(productId);

            if (customerOptional.isPresent()) {
                Customer customer = customerOptional.get();
               // ResponseProductDto product = productOptional.get();

                // Utiliser l'ID du PaymentMethod pour créer la charge
                Charge charge = stripeService.createCharge(amount, currency, paymentMethodId, "Example charge", customer.getStripeCustomerId());

                // Créer et enregistrer la commande

                return "Payment successful: " + charge.getId();
            } else {
                return "Customer or Product not found.";
            }
        } catch (StripeException e) {
            return "Payment failed: " + e.getMessage();
        }
    }

    @PublicEndpoint
    @GetMapping("/charge/{stripeChargeId}")
    public ResponseEntity<HistoricOrder> getOrderByChargeId(@PathVariable String stripeChargeId) {
        Optional<HistoricOrder> order = orderService.getOrderByChargeId(stripeChargeId);
        return order.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PublicEndpoint
    @PostMapping("/charge/anonymous")
    public String chargeAnonymous(@RequestParam int amount, @RequestParam String currency,
                                  @RequestParam String paymentMethodId, @RequestParam(required = false) String customerId) {
        try {
            Charge charge = stripeService.createAnonymousCharge(amount, currency, paymentMethodId, "Payment for guest", customerId);
            return "Payment successful: " + charge.getId();
        } catch (StripeException e) {
            return "Payment failed: " + e.getMessage();
        }
    }
}
