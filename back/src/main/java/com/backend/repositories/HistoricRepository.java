package com.backend.repositories;
import com.backend.entities.HistoricOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoricRepository extends JpaRepository<HistoricOrder, Long> {

    List<HistoricOrder> findByCustomerId(Long customerId);
    List<HistoricOrder> findByOrderId(String orderId);
}
