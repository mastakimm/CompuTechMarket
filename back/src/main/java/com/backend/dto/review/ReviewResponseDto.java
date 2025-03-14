package com.backend.dto.review;

import com.backend.dto.customerDto.SimpleCustomerDto;

public class ReviewResponseDto {

    private Long id;
    private String review;
    private Double stars;
    private SimpleCustomerDto customer;

    public ReviewResponseDto(Long id, String review, Double stars, SimpleCustomerDto customer) {
        this.id = id;
        this.review = review;
        this.stars = stars;
        this.customer = customer;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public SimpleCustomerDto getCustomer() {
        return customer;
    }

    public void setCustomer(SimpleCustomerDto customer) {
        this.customer = customer;
    }
}
