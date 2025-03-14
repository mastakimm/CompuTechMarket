package com.backend.controllers;


import com.backend.dto.historic.HistoricOrderResponseDto;
import com.backend.dto.historic.HistoricOrderRequestDto;
import com.backend.entities.HistoricOrder;
import com.backend.internal.PublicEndpoint;
import com.backend.repositories.HistoricRepository;
import com.backend.services.HistoricService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/historic")
public class HistoricController {

    @Autowired
    private HistoricService historicService;

    @PublicEndpoint
    @PostMapping("/create-historic")
    public HistoricOrder createHistoricOrder(@Valid @RequestBody HistoricOrderRequestDto request) {
        return historicService.saveHistoricOrder(request);
    }

    @PublicEndpoint
    @GetMapping("/all")
    public List<HistoricOrderResponseDto> getAllHistoricOrders() {
        return historicService.getAllHistoricOrders();
    }

    @PublicEndpoint
    @GetMapping("/user/{customerId}")
    public List<HistoricOrderResponseDto> getHistoricOrdersByCustomerId(@PathVariable Long customerId) {
        return historicService.getHistoricOrdersByCustomerId(customerId);
    }

    @PublicEndpoint
    @GetMapping("/command/{orderId}")
    public List<HistoricOrder> getHistoricOrdersByCommandId(@PathVariable String orderId) {
        return historicService.getHistoricOrdersByCommandId(orderId);
    }

}