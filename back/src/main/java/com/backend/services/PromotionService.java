package com.backend.services;

import com.backend.dto.ResponseProductDto;
import com.backend.entities.Promotion;
import com.backend.repositories.PromotionRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend.entities.Product;
import com.backend.dto.promotion.PromotionDto;
import com.backend.repositories.ProductRepository;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class PromotionService {

    private static final Logger log = LoggerFactory.getLogger(PromotionService.class);
    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public PromotionDto createPromotion(PromotionDto promotionDto) {
        try {
            System.out.println("Starting creation of promotion for product ID: " + promotionDto.getProductId());

            Product product = productRepository.findById(promotionDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            System.out.println("Product found: " + product.getName());

            Optional<Promotion> existingPromotion = promotionRepository.findByProductId(promotionDto.getProductId());

            if (existingPromotion.isPresent()) {
                System.err.println("Promotion already exists for product ID: " + promotionDto.getProductId());
                throw new RuntimeException("A promotion already exists for this product. Please use the update method.");
            }

            Promotion promotion = new Promotion();
            promotion.setProduct(product);
            promotion.setPromotion(promotionDto.getPromotion());
            promotion.setStock(promotionDto.getStock());
            promotion.setStarted_at(promotionDto.getStarted_at());
            promotion.setEnd_at(promotionDto.getEnd_at());

            promotion = promotionRepository.save(promotion);
            System.out.println("Promotion created successfully for product ID: " + promotionDto.getProductId());

            return mapToDto(promotion);
        } catch (RuntimeException e) {
            System.err.println("Error creating promotion: " + e.getMessage());
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_FOUND);
            throw new RuntimeException("Error creating promotion", e);
        }
    }

    public List<ResponseProductDto> getProductsWithPromotionsByProductId(Long productId) {
        try{
        List<Promotion> promotions = promotionRepository.findAllByProductId(productId);

        return promotions.stream()
                .map(promotion -> {
                    Product product = promotion.getProduct();
                    List<PromotionDto> promotionDtos = promotions.stream()
                            .map(this::mapToDto)
                            .collect(Collectors.toList());
                    return new ResponseProductDto(product, promotionDtos);
                })
                .collect(Collectors.toList());
        }catch (Exception e){
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_FOUND);
            throw new RuntimeException("Product not find", e);
        }
    }


    @Transactional
    public PromotionDto updatePromotion(Long productId, PromotionDto promotionDto) {
        try {
            Promotion promotion = promotionRepository.findByProductId(productId)
                    .orElseThrow(() -> new RuntimeException("Promotion not found"));

            Product product = productRepository.findById(promotionDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            promotion.setProduct(product);
            promotion.setPromotion(promotionDto.getPromotion());
            promotion.setStarted_at(promotionDto.getStarted_at());
            promotion.setStock(promotionDto.getStock());
            promotion.setEnd_at(promotionDto.getEnd_at());

            promotion = promotionRepository.save(promotion);

            return mapToDto(promotion);
        } catch (RuntimeException e) {
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_FOUND);
            throw new RuntimeException("Error updating promotion", e);
        }
    }

    @Transactional
    public List<ResponseProductDto> getAllProductsWithPromotions() {
        try {
            List<Product> products = promotionRepository.findAllProductsWithPromotions();

            return products.stream()
                    .map(product -> {
                        System.out.println("Product description: " + product.getDescription());
                        List<Promotion> promotions = promotionRepository.findAllByProductId(product.getId());

                        List<PromotionDto> promotionDtos = promotions.stream()
                                .map(this::mapToDto)
                                .collect(Collectors.toList());

                        return new ResponseProductDto(product, promotionDtos);
                    })
                    .collect(Collectors.toList());
        }catch (Exception e) {
            Api.Error(ErrorCode.COMPONENTS_PC_NOT_FOUND);
            throw new RuntimeException("Error retrieving all products with promotions", e);
        }
    }

    private PromotionDto mapToDto(Promotion promotion) {
        PromotionDto dto = new PromotionDto();
        dto.setProductId(promotion.getProduct().getId());
        dto.setPromotion(promotion.getPromotion());
        dto.setStarted_at(promotion.getStarted_at());
        dto.setEnd_at(promotion.getEnd_at());
        dto.setStock(promotion.getStock());
        return dto;
    }
}



