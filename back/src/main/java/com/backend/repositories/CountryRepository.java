package com.backend.repositories;

import com.backend.entities.Country;
import com.backend.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryRepository extends JpaRepository<Country, Long> {
    Country findByName(String name);
}
