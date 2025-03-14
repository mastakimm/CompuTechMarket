package com.backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
public class ProductSubCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "parent_id", nullable = false)
    @JsonBackReference
    private ProductCategory parentCategory;

    private String name;

    @OneToMany(mappedBy = "productSubCategory")
    @JsonBackReference
    private List<Product> products;

    public ProductSubCategory() {}

    public ProductSubCategory(String name, ProductCategory parentCategory) {
        this.name = name;
        this.parentCategory = parentCategory;
    }

}
