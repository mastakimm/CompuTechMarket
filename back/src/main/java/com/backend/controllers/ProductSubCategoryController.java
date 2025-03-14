package com.backend.controllers;

import com.backend.entities.ProductSubCategory;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;
import com.backend.internal.PublicEndpoint;
import com.backend.repositories.ProductSubCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/subCategories")
public class ProductSubCategoryController {

    @Autowired
    ProductSubCategoryRepository productSubCategoryRepository;

    @PublicEndpoint
    @DeleteMapping("/subCategories/{id}")
    public void deleteSubCategory(@PathVariable Long id) {
        Optional<ProductSubCategory> productSubCategory = productSubCategoryRepository.findById(id);

        if (productSubCategory.isEmpty()) {
            Api.Error(ErrorCode.PRODUCT_SUB_CATEGORY_NOT_FOUND);
        }

        productSubCategoryRepository.delete(productSubCategory.get());
    }
}
