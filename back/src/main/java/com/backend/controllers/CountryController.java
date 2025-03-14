package com.backend.controllers;

import com.backend.entities.Country;
import com.backend.internal.PublicEndpoint;
import com.backend.repositories.CountryRepository;
import com.backend.services.CountryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("country")
public class CountryController {

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private CountryService countryService;

    @PublicEndpoint
    @GetMapping()
    public List<Country> getAllCountries () {
        return countryRepository.findAll();
    }

    @PublicEndpoint
    @GetMapping("/{id}")
    public Country getCountryById(@PathVariable Long id) {
        return countryService.getByCountryById(id);
    }

    @PublicEndpoint
    @GetMapping("/name/{countryName}")
    public Country getCountryByCountryName(@PathVariable String countryName) {
        return countryService.getCountryByCountryName(countryName);
    }
}
