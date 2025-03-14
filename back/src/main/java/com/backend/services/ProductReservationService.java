package com.backend.services;

import com.backend.entities.ProductReservation;
import com.backend.entities.Stock;
import com.backend.repositories.ProductReservationRepository;
import com.backend.repositories.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductReservationService {

    @Autowired
    private ProductReservationRepository productReservationRepository;

    @Autowired
    private StockRepository stockRepository;

    public void fulfillReservations(List<ProductReservation> reservations) {
        productReservationRepository.deleteAll(reservations);
    }

    public void cancelReservations(List<ProductReservation> reservations) {
        for (ProductReservation reservation : reservations) {
            Stock stock = reservation.getStock();
            stock.setQuantity(stock.getQuantity() + reservation.getQuantity());
            stockRepository.save(stock);
        }
        productReservationRepository.deleteAll(reservations);
    }
}
