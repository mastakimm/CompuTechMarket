package com.backend.entities;

import com.backend.enums.DeliveryMethod;
import com.backend.enums.DeliverySpeed;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
public class DeliveryFee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private DeliveryMethod deliveryMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private DeliverySpeed deliverySpeed;

    @Column(nullable = false)
    private String feePercentage;

    public DeliveryFee() {
        this.feePercentage = "0";
    }
}
