package com.backend.services;

import com.backend.dto.componentType.RequestNewComponentType;
import com.backend.entities.ProductCategory;
import com.backend.entities.FileUpload;
import com.backend.entities.ProductSubCategory;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;
import com.backend.repositories.ProductCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductCategoryService {

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Autowired
    private FileUploadService fileUploadService;

    public List<ProductCategory> getAll() {
        try {
            List<ProductCategory> productCategories = productCategoryRepository.findAll();
            // Fetch pictures explicitly if needed
            productCategories.forEach(ct -> {
                if (ct.getFileUpload() != null) {
                    ct.getFileUpload().getFile();
                }
            });
            return productCategories;
        } catch (Exception e) {
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_INSERT);
            throw new RuntimeException("Error occurred while fetching all Component Types", e);
        }
    }

    public ProductCategory createComponentType(RequestNewComponentType request) {
        Optional<ProductCategory> existingCategory = productCategoryRepository.findByName(request.getName());

        if (existingCategory.isPresent()) {
            Api.Error(ErrorCode.CATEGORY_ALREADY_EXISTS);
            throw new RuntimeException("Category with the same name already exists");
        }

        ProductCategory productCategory = new ProductCategory();
        productCategory.setName(request.getName());

        FileUpload fileUpload = new FileUpload();
        fileUpload.setFile(request.getPicture());
        fileUpload.setProductCategory(productCategory);

        productCategory.setFileUpload(fileUpload);

        return productCategoryRepository.save(productCategory);
    }

    public void deleteById(Long id) {
        try {
            productCategoryRepository.deleteById(id);
        } catch (Exception e) {
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_DELETE);
            throw new RuntimeException("Error occurred while deleting the Component by ID", e);
        }
    }


    public List<ProductSubCategory> getById(Long id) {
        try {
            ProductCategory productCategory = productCategoryRepository.findById(id).get();

            return productCategory.getSubCategories();

        } catch (Exception e) {
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_FOUND);
        }
        return null;
    }

    public ProductCategory updateProductCategory(Long id, RequestNewComponentType request) {
        ProductCategory productCategory = productCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        productCategory.setName(request.getName());

        if (request.getPicture() != null && !request.getPicture().isEmpty()) {
            FileUpload fileUpload = productCategory.getFileUpload();

            if (fileUpload != null) {
                fileUpload.setFile(request.getPicture());
            } else {
                fileUpload = new FileUpload();
                fileUpload.setFile(request.getPicture());
                fileUpload.setProductCategory(productCategory);
                productCategory.setFileUpload(fileUpload);
            }
        }

        return productCategoryRepository.save(productCategory);
    }
}
