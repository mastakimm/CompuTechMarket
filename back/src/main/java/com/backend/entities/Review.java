package com.backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference
    private Product product;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String review;

    @Column(nullable = false)
    private Double stars;

    public Review() {
    }

    public Review(Customer customer, Product product, String review, Double stars) {
        this.customer = customer;
        this.product = product;
        this.review = review;
        this.stars = stars;
    }
}
