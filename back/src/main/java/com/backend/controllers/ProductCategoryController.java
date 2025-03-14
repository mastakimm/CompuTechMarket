package com.backend.controllers;

import com.backend.entities.ProductCategory;
import com.backend.entities.ProductSubCategory;
import com.backend.internal.PublicEndpoint;
import com.backend.repositories.ProductCategoryRepository;
import com.backend.repositories.ProductRepository;
import com.backend.services.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/componentType")
public class ProductCategoryController {

    @Autowired
    private ProductCategoryService productCategoryService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @PublicEndpoint
    @GetMapping("/all")
    public List<ProductCategory> getAllComponentTypes() {
        return productCategoryService.getAll();
    }

    @PublicEndpoint
    @GetMapping("/{id}")
    public Optional<ProductCategory> getCategoryById(@PathVariable Long id) {
        return productCategoryRepository.findById(id);
    }

    @PublicEndpoint
    @GetMapping("/{id}/sub-categories")
    public List<ProductSubCategory> getComponentTypeById(@PathVariable Long id) {
        return productCategoryService.getById(id);
    }
}
