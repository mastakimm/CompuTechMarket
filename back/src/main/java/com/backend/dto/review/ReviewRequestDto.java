package com.backend.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ReviewRequestDto {
    @NotNull
    private Long customerId;

    @NotNull
    private Long productId;

    @NotNull
    @Size(max = 5000, message = "Review cannot be longer than 5000 characters")
    private String review;

    @NotNull
    @Min(value = 0, message = "Stars cannot be less than 0")
    @Max(value = 5, message = "Stars cannot be more than 5")
    private Double stars;

    // Getters and Setters

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public Double getStars() {
        return stars;
    }

    public void setStars(Double stars) {
        this.stars = stars;
    }
}
