package com.backend.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@AllArgsConstructor
@Entity
public class CustomerRole {

    private String name;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public CustomerRole() {
    }

    @Override
    public String toString() {
        return "CustomerRole{" +
                "name='" + name + '\'' +
                ", id=" + id +
                '}';
    }
}
