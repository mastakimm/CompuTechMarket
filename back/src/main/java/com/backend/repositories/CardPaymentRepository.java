package com.backend.repositories;

import com.backend.entities.CardPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CardPaymentRepository extends JpaRepository<CardPayment, Long> {
    List<CardPayment> findByCustomerId(Long customerId);
}
