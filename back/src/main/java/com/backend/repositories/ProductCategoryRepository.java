package com.backend.repositories;

import com.backend.entities.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {

    @Query("SELECT ct FROM ProductCategory ct JOIN FETCH ct.subCategories WHERE ct.id = :id")
    Optional<ProductCategory> findByIdWithSubCategories(@Param("id") Long id);

    Optional<ProductCategory> findByName(String name);
}
