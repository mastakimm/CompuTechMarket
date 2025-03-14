package com.backend.services;

import com.backend.dto.ResponseProductDto;
import com.backend.dto.historic.HistoricOrderRequestDto;
import com.backend.dto.historic.HistoricOrderResponseDto;
import com.backend.dto.customerDto.SimpleCustomerDto;
import com.backend.entities.Customer;
import com.backend.entities.HistoricOrder;
import com.backend.entities.Product;
import com.backend.repositories.CustomerRepository;
import com.backend.repositories.HistoricRepository;
import com.backend.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;

import javax.swing.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HistoricService {

    @Autowired
    private HistoricRepository historicRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    public HistoricOrder saveHistoricOrder(HistoricOrderRequestDto requestDto) {
        Optional<Customer> optionalCustomer = customerRepository.findById(requestDto.getCustomerId());
        Optional<Product> optionalProduct = productRepository.findById(requestDto.getProductId());

        if (optionalCustomer.isEmpty() || optionalProduct.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        Customer customer = optionalCustomer.get();
        Product product = optionalProduct.get();

        HistoricOrder historicOrder = new HistoricOrder();
        historicOrder.setQuantity(requestDto.getQuantity());
        historicOrder.setOrderDate(requestDto.getOrderDate());
        historicOrder.setDeliveryId(requestDto.getDeliveryId());
        historicOrder.setOrderId(requestDto.getOrderId());
        historicOrder.setCustomer(customer);
        historicOrder.setProduct(product);
        historicOrder.setAdresseId(requestDto.getAdresseId());
        historicOrder.setTva(requestDto.getTva());
        historicOrder.setStripeChargeId(requestDto.getStripeChargeId());

        return historicRepository.save(historicOrder);
    }

    public List<HistoricOrderResponseDto> getAllHistoricOrders() {
        List<HistoricOrder> historicOrders = historicRepository.findAll();
        return historicOrders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private HistoricOrderResponseDto convertToDto(HistoricOrder order) {
        SimpleCustomerDto customerDto = new SimpleCustomerDto();
        customerDto.setId(order.getCustomer().getId());
        customerDto.setDisplayName(order.getCustomer().getDisplayName());

        ResponseProductDto productDto = new ResponseProductDto();
        productDto.setId(order.getProduct().getId());
        productDto.setName(order.getProduct().getName());

        return new HistoricOrderResponseDto(
                order.getId(),
                order.getQuantity(),
                order.getOrderDate(),
                order.getDeliveryId(),
                order.getOrderId(),
                customerDto,
                productDto,
                order.getProduct().getId(),
                order.getStripeChargeId(),
                order.getAdresseId(),
                order.getTva()
        );
    }

    public List<HistoricOrderResponseDto> getHistoricOrdersByCustomerId(Long customerId) {
        Optional<Customer> optionalCustomer = customerRepository.findById(customerId);

        if (optionalCustomer.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
            return new ArrayList<>();
        }
        Customer customer = optionalCustomer.get();

        List<HistoricOrder> historicOrders = historicRepository.findByCustomerId(customer.getId());

        return historicOrders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

/*
    private HistoricOrderResponseDto convertToDto(HistoricOrder historicOrder) {
        try {
            if (historicOrder.getCustomer() == null) {
                Api.Error(ErrorCode.CUSTOMER_NOT_FOUND);
                throw new RuntimeException("Customer not found for the historic order.");
            }

            if (historicOrder.getProduct() == null) {
                Api.Error(ErrorCode.PRODUCT_NOT_FOUND);
                throw new RuntimeException("Product not found for the historic order.");
            }

            SimpleCustomerDto customerDto = new SimpleCustomerDto();
            customerDto.setEmail(historicOrder.getCustomer().getEmail());
            customerDto.setDisplayName(historicOrder.getCustomer().getDisplayName());

            //ResponseProductDto productDto = new ResponseProductDto(historicOrder.getProduct(), promotions);


            HistoricOrderResponseDto dto = new HistoricOrderResponseDto();
            dto.setId(historicOrder.getId());
            dto.setQuantity(historicOrder.getQuantity());
            dto.setOrderedDate(historicOrder.getOrderedDate());
            dto.setIdLivraison(historicOrder.getIdLivraison());
            dto.setIdCommand(historicOrder.getIdCommand());
            dto.setCustomer(customerDto);
            //dto.setProduct(productDto);

            return dto;
        } catch (NullPointerException e) {
            Api.Error(ErrorCode.INVALID_DATA);
            throw new RuntimeException("Invalid data encountered during conversion", e);
        } catch (Exception e) {
            Api.Error(ErrorCode.CONVERSION_ERROR);
            throw new RuntimeException("Error converting historic order to DTO", e);
        }

      // TODO
        //return historicRepository.findByCustomerId(customer.getId());
    }*/

    public List<HistoricOrder> getHistoricOrdersByCommandId(String orderId) {
        return historicRepository.findByOrderId(orderId);
    }
}