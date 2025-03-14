package com.backend.dto.component;

import com.backend.internal.DTO;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@DTO
public class RequestNewComponent {

    @NotNull(message = "Name cannot be null")
    @NotEmpty(message = "Name cannot be empty")
    private String name;

    @NotNull(message = "Model cannot be null")
    @NotEmpty(message = "Model cannot be empty")
    private String model;

    @NotNull(message = "Manufacturer cannot be null")
    @NotEmpty(message = "Manufacturer cannot be empty")
    private String manufacturer;

    @NotNull(message = "Price cannot be null")
    private BigDecimal price;

    @NotNull(message = "Picture list cannot be null")
    @NotEmpty(message = "Picture list cannot be empty")
    private List<String> picture;

    @NotNull(message = "Description cannot be null")
    @NotEmpty(message = "Description cannot be empty")
    private String description;

    @NotNull(message = "Specifications cannot be null")
    @NotEmpty(message = "Specifications cannot be empty")
    private String specifications;

    @NotNull(message = "Quantity cannot be null")
    private Integer quantity;

    @NotNull(message = "Weight cannot be null")
    private BigDecimal weight;

    @NotNull(message = "Height cannot be null")
    private BigDecimal height;

    @NotNull(message = "Width cannot be null")
    private BigDecimal width;

    @NotNull(message = "Length cannot be null")
    private BigDecimal length;

    @NotNull(message = "Type ID cannot be null")
    private Long typeId;

    @NotNull(message = "SubCategory ID cannot be null")
    private Long subCategoryId;

    private Long recommended_restock;

    @NotNull(message = "Color cannot be null")
    @NotEmpty(message = "Color cannot be empty")
    private String color;
}
