package com.backend.repositories;
import com.backend.entities.Product;
import com.backend.entities.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PromotionRepository extends JpaRepository <Promotion, Long> {

    List<Promotion> findAllByProductId(Long productId);
    Optional<Promotion> findByProductId(Long productId);

    @Query("SELECT DISTINCT p FROM Promotion pr JOIN pr.product p")
    List<Product> findAllProductsWithPromotions();
}
