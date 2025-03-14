package com.backend.dto;

import com.backend.dto.promotion.PromotionDto;
import com.backend.dto.stock.StockDto;
import com.backend.entities.Product;
import com.backend.internal.DTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
@Getter
@Setter
@AllArgsConstructor
public class ResponseProductDto {

    private Long id;
    private ProductCategoryDto typeId;
    private String name;
    private String manufacturer;
    private String model;
    private BigDecimal price;
    private BigDecimal weight;
    private BigDecimal height;
    private BigDecimal width;
    private BigDecimal length;
    private String specifications;
    private Integer quantity;
    private String description;
    private String color;
    private List<FileUploadDto> files;
    private ProductSubCategoryDto productSubCategory;
    private Set<ProductVariantDto> variants;
    private List<PromotionDto> promotions;  
    private Date created_at;
    private Long recommended_restock;

    public ResponseProductDto(Product product, List<PromotionDto> promotions) {
        this.id = product.getId();
        this.typeId = new ProductCategoryDto(product.getTypeId());
        this.name = product.getName();
        this.manufacturer = product.getManufacturer();
        this.model = product.getModel();
        this.price = product.getPrice();
        this.weight = product.getWeight();
        this.height = product.getHeight();
        this.width = product.getWidth();
        this.length = product.getLength();
        this.specifications = product.getSpecifications();
        this.quantity = product.getQuantity();
        this.description = product.getDescription();
        this.color = product.getColor();
        this.files = product.getFiles().stream()
                .map(FileUploadDto::new)
                .collect(Collectors.toList());
        assert product.getProductSubCategory() != null;
        this.created_at = product.getCreated_at();
        this.recommended_restock = product.getRecommended_restock();
        this.productSubCategory = new ProductSubCategoryDto(product.getProductSubCategory());
        this.variants = product.getVariants().stream()
                .map(ProductVariantDto::new)
                .collect(Collectors.toSet());
        this.promotions = promotions;
    }

    public ResponseProductDto() {

    }
}
