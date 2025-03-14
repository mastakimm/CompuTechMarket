package com.backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonBackReference
    private Customer customer;
    private String address;
    private String zipcode;
    private String country;
    private String billing_address;
    private String phone_number;
    private String city;
    private String firstname;
    private String lastname;

    @Column(nullable = true)
    private Boolean isActive;

    public UserProfile() {}
}
