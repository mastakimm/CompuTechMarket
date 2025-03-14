package com.backend.controllers;

import com.backend.dto.ResponseProductDto;
import com.backend.entities.ProductSubCategory;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;
import com.backend.internal.PublicEndpoint;
import com.backend.repositories.ProductRepository;
import com.backend.repositories.ProductSubCategoryRepository;
import com.backend.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.backend.entities.Product;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/component")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductSubCategoryRepository productSubCategoryRepository;

    @PublicEndpoint
    @GetMapping("/all")
    public List<ResponseProductDto> getAllComponents() {
        return productService.getAll();
    }

    @PublicEndpoint
    @GetMapping("/{id}")
    public Optional<ResponseProductDto> getComponentById(@PathVariable Long id) {
        return productService.getById(id);
    }

    @PublicEndpoint
    @GetMapping("/type/{id}")
    public List<ResponseProductDto> getComponentsByTypeAndOrName(@PathVariable Long id, @RequestParam(required = false) String name) {
        if (name == null || name.isEmpty()) {
            return productService.getComponentsByType(id);
        } else {
            return productService.getComponentsByTypeAndName(id, name);
        }
    }

    @PublicEndpoint
    @GetMapping()
    public List<ResponseProductDto> getFilteredComponent(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return productService.findWithFilters(name, description, minPrice, maxPrice);
    }

    @PublicEndpoint
    @GetMapping("/sub-categories/{id}")
    public List<Product> getComponentsBySubCategory(@PathVariable Long id) {
        Optional<ProductSubCategory> productSubCategory = productSubCategoryRepository.findById(id);
        if (productSubCategory.isEmpty()) {
            Api.Error(ErrorCode.PRODUCT_SUB_CATEGORY_NOT_FOUND);
        }

        return productRepository.findByProductSubCategoryId(id);
    }
}