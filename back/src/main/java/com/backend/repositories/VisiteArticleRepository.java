package com.backend.repositories;

import com.backend.entities.Product;
import com.backend.entities.VisiteArticle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface VisiteArticleRepository extends JpaRepository<VisiteArticle, Long> {
    VisiteArticle findByProduct(Product product);
    Optional<VisiteArticle> findTopByOrderByCountDesc();
    List<VisiteArticle> findTop2ByOrderByCountDesc();
    List<VisiteArticle> getAllByOrderByCountDesc();
}
