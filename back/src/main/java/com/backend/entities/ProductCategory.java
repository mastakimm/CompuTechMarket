package com.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Entity
public class ProductCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "parentCategory", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ProductSubCategory> subCategories;

    @OneToMany(mappedBy = "typeId")
    @JsonIgnore
    private List<Product> products;

    @OneToOne(mappedBy = "productCategory", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private FileUpload fileUpload;

    private String name;

    public ProductCategory() {}

    public ProductCategory(String name) {
        this.name = name;
    }
}
