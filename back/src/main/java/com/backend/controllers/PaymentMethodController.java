package com.backend.controllers;

import com.backend.entities.PaymentMethod;
import com.backend.internal.PublicEndpoint;
import com.backend.repositories.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("payment-methods")
public class PaymentMethodController {

    @Autowired
    PaymentMethodRepository paymentMethodRepository;

    @PublicEndpoint
    @PostMapping("/getByName")
    public PaymentMethod getPaymentMethodByName(@RequestBody Map<String, String> requestBody) {
        String name = requestBody.get("name");
        return paymentMethodRepository.findByName(name);
    }
}
