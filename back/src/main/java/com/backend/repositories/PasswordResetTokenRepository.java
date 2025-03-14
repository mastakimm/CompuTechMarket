package com.backend.repositories;

import com.backend.entities.Customer;
import com.backend.entities.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Integer deleteByCustomer(Customer customer);

    PasswordResetToken findByToken(String token);
}
