package com.backend.controllers;

import com.backend.dto.ResponseProductDto;
import com.backend.entities.VisiteArticle;
import com.backend.internal.PublicEndpoint;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.backend.services.PromotionService;
import com.backend.dto.promotion.PromotionDto;

import com.backend.entities.Promotion;

import java.util.List;

@RestController
@RequestMapping("/promotion")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @PublicEndpoint
    @PostMapping("/create")
    public ResponseEntity<PromotionDto> createPromotion(@Valid @RequestBody PromotionDto promotionDto) {
        PromotionDto createdPromotion = promotionService.createPromotion(promotionDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPromotion);
    }

    @PublicEndpoint
    @PutMapping("/update/{id}")
    public ResponseEntity<PromotionDto> updatePromotion(@PathVariable Long id, @Valid @RequestBody PromotionDto promotionDto) {
        PromotionDto updatedPromotion = promotionService.updatePromotion(id, promotionDto);
        return ResponseEntity.ok(updatedPromotion);
    }

    @PublicEndpoint
    @GetMapping("/product")
    public List<ResponseProductDto> getAllProductsWithPromotions() {
        return promotionService.getAllProductsWithPromotions();
    }
    @PublicEndpoint
    @GetMapping("/product/{id}")
    public ResponseEntity<List<ResponseProductDto>> getProductsWithPromotionsWithProductId(@PathVariable Long id) {
        List<ResponseProductDto> products = promotionService.getProductsWithPromotionsByProductId(id);
        return ResponseEntity.ok(products);
    }
}
