package com.backend.controllers;

import com.backend.entities.Product;
import com.backend.entities.ProductReservation;
import com.backend.internal.PublicEndpoint;
import com.backend.repositories.StockRepository;
import com.backend.services.ProductService;
import com.backend.services.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stocks")
public class StockController {

    @Autowired
    ProductService productService;

    @Autowired
    StockRepository stockRepository;

    @Autowired
    StockService stockService;

    @PublicEndpoint
    @PutMapping("{productId}/{quantity}")
    public List<ProductReservation> decrementProductStock(@PathVariable Long productId, @PathVariable int quantity) {
        return productService.decrementOldestStock(productId, quantity);
    }
}
