package com.backend.dto.stock;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
public class StockResponseDto {

    private Long id;
    private String supplier;
    private Date refillDate;
    private Integer quantity;
    private BigDecimal purchasePrice;
    private BigDecimal sellingPrice;
    private Long productId;

    public StockResponseDto(Long id, String supplier, Date refillDate, Integer quantity, BigDecimal purchasePrice, BigDecimal sellingPrice, Long productId) {
        this.id = id;
        this.supplier = supplier;
        this.refillDate = refillDate;
        this.quantity = quantity;
        this.purchasePrice = purchasePrice;
        this.productId = productId;
        this.sellingPrice = sellingPrice;
    }
}
