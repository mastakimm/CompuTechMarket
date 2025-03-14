package com.backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private Product product;

    private BigDecimal promotion;

    @Temporal(TemporalType.TIMESTAMP)
    private Date created_at = new Date();

    private Integer stock;

    @Temporal(TemporalType.TIMESTAMP)
    private Date started_at;

    @Temporal(TemporalType.TIMESTAMP)
    private Date end_at;

    @PrePersist
    protected void onCreate() {
        created_at = new Date();
    }

}
