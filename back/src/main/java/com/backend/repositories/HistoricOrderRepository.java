package com.backend.repositories;

import com.backend.entities.HistoricOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HistoricOrderRepository extends JpaRepository<HistoricOrder, Long> {

    Optional<HistoricOrder> findByStripeChargeId(String stripeChargeId);
}
