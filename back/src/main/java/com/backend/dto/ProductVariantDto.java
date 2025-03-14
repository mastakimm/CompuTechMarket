package com.backend.dto;

import com.backend.entities.Product;
import com.backend.internal.DTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProductVariantDto {
    private Long id;
    private String color;
    private String height;
    private String weight;
    private String length;
    private String width;

    public ProductVariantDto(Product product) {
        this.id = product.getId();
        this.color = product.getColor();
        this.height = product.getHeight().toString();
        this.weight = product.getWeight().toString();
        this.length = product.getLength().toString();
        this.width = product.getWidth().toString();
    }
}