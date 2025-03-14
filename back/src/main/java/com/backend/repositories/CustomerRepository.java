package com.backend.repositories;

import com.backend.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByEmail(String email);
    Optional<Customer> findByIdAndStripeCustomerId(Long id, String stripeCustomerId);
    Optional<Customer> findByStripeCustomerId(String stripeCustomerId);
}
