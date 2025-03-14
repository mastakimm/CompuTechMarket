package com.backend.repositories;

import com.backend.entities.Product;
import com.backend.entities.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findByTypeId(ProductCategory typeId);

    List<Product> findByProductSubCategoryId(Long subCategoryId);

    List<Product> findByModelAndNameAndManufacturer(String model, String name, String manufacturer);

    @Query("SELECT p FROM Product p ORDER BY p.id DESC")
    Product findTopByOrderByIdDesc();

    Product findFirstByOrderByIdDesc();
}
