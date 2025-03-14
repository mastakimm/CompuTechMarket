package com.backend.repositories;

import com.backend.entities.Customer;
import com.backend.entities.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    Token findByCustomerAndOtp(Customer customer, String otp);

    Integer deleteByCustomer(Customer customer);
}