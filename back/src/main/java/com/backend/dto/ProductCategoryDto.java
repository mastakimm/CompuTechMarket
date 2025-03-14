package com.backend.dto;

import com.backend.entities.ProductCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProductCategoryDto {
    private Long id;
    private String name;

    public ProductCategoryDto(ProductCategory category) {
        this.id = category.getId();
        this.name = category.getName();
    }
}