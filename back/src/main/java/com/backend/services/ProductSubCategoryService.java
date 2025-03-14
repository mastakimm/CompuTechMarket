package com.backend.services;

import com.backend.dto.productSubCategoryType.RequestProductSubCategory;
import com.backend.entities.ProductCategory;
import com.backend.entities.ProductSubCategory;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;
import com.backend.repositories.ProductCategoryRepository;
import com.backend.repositories.ProductSubCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductSubCategoryService {

    @Autowired
    private ProductSubCategoryRepository productSubCategoryRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    public List<ProductSubCategory> getAllSubCategories() {
        try {
            return productSubCategoryRepository.findAll();
        } catch (Exception e) {
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_FOUND);
            throw new RuntimeException("Error occurred while fetching all SubCategories", e);
        }
    }

    public ProductSubCategory createSubCategory(RequestProductSubCategory request) {
        try {
            Optional<ProductCategory> parentCategoryOpt = productCategoryRepository.findById(request.getParentCategoryId());

            if (parentCategoryOpt.isPresent()) {
                ProductSubCategory subCategory = new ProductSubCategory();
                subCategory.setName(request.getName());
                subCategory.setParentCategory(parentCategoryOpt.get());

                return productSubCategoryRepository.save(subCategory);
            } else {
                throw new RuntimeException("Parent Category not found");
            }
        } catch (Exception e) {
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_INSERT);
            throw new RuntimeException("Error occurred while creating SubCategory", e);
        }
    }

    public ProductSubCategory updateSubCategory(Long id, RequestProductSubCategory request) {
        try {
            Optional<ProductSubCategory> existingSubCategoryOpt = productSubCategoryRepository.findById(id);

            if (existingSubCategoryOpt.isPresent()) {
                ProductSubCategory subCategory = existingSubCategoryOpt.get();
                subCategory.setName(request.getName());

                if (request.getParentCategoryId() != null) {
                    Optional<ProductCategory> parentCategoryOpt = productCategoryRepository.findById(request.getParentCategoryId());
                    parentCategoryOpt.ifPresent(subCategory::setParentCategory);
                }

                return productSubCategoryRepository.save(subCategory);
            } else {
                throw new RuntimeException("SubCategory not found");
            }
        } catch (Exception e) {
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_FOUND);
            throw new RuntimeException("Error occurred while updating SubCategory", e);
        }
    }

    public void deleteSubCategory(Long id) {
        try {
            productSubCategoryRepository.deleteById(id);
        } catch (Exception e) {
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_DELETE);
            throw new RuntimeException("Error occurred while deleting SubCategory", e);
        }
    }

    public ProductSubCategory getSubCategoryById(Long id) {
        try {
            return productSubCategoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("SubCategory not found"));
        } catch (Exception e) {
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_FOUND);
            throw new RuntimeException("Error occurred while fetching SubCategory by ID", e);
        }
    }
}
