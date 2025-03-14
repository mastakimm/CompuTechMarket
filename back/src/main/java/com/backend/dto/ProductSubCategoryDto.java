package com.backend.dto;

import com.backend.entities.ProductSubCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProductSubCategoryDto {
    private Long id;
    private String name;

    public ProductSubCategoryDto(ProductSubCategory subCategory) {
        this.id = subCategory.getId();
        this.name = subCategory.getName();
    }
}

