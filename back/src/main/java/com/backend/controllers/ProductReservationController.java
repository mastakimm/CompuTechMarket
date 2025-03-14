package com.backend.controllers;

import com.backend.entities.ProductReservation;
import com.backend.internal.PublicEndpoint;
import com.backend.repositories.ProductReservationRepository;
import com.backend.services.ProductReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("product-reservation")
public class ProductReservationController {

    @Autowired
    private ProductReservationRepository productReservationRepository;

    @Autowired
    private ProductReservationService productReservationService;

    @PublicEndpoint
    @PostMapping
    public void fulfillReservations(@RequestBody List<Long> reservationIds) {
        List<ProductReservation> reservations = productReservationRepository.findAllById(reservationIds);
        this.productReservationService.fulfillReservations(reservations);
    }

    @PublicEndpoint
    @DeleteMapping
    public void cancelReservations(@RequestBody List<Long> reservationIds) {
        List<ProductReservation> reservations = productReservationRepository.findAllById(reservationIds);
        productReservationService.cancelReservations(reservations);
    }

}
