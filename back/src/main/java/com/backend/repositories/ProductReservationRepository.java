package com.backend.repositories;

import com.backend.entities.ProductReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductReservationRepository extends JpaRepository<ProductReservation, Long> {
}
