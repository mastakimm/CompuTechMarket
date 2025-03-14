package com.backend.repositories;

import com.backend.entities.Product;
import com.backend.entities.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    List<Stock> findByProduct(Product product);

    List<Stock> findByProductOrderByRefillDateAsc(Product product);

    Optional<Stock> findFirstByProductOrderByRefillDateAsc(Product product);
}
