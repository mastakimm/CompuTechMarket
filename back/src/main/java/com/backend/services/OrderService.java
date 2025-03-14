package com.backend.services;

import com.backend.dto.ResponseProductDto;
import com.backend.entities.Customer;
import com.backend.entities.HistoricOrder;
import com.backend.entities.Product;
import com.backend.repositories.HistoricOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;

import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private HistoricOrderRepository historicOrderRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    public OrderService(HistoricOrderRepository historicOrderRepository) {
        this.historicOrderRepository = historicOrderRepository;
    }

    public Optional<HistoricOrder> getOrderByChargeId(String stripeChargeId) {
        try{
            return historicOrderRepository.findByStripeChargeId(stripeChargeId);
        }catch (Exception e) {
            Api.Error(ErrorCode.NOT_FOUND);
            throw new RuntimeException("Error during the get of order :", e);
        }
    }
}
