package com.backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class VisiteArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = true)
    @JsonBackReference
    private Product product;

    private int count;

    public VisiteArticle() {}

    public VisiteArticle(Product product, int count) {
        this.product = product;
        this.count = count;
    }
}
