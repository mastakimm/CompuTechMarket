package com.backend.services;

import com.backend.entities.Country;
import com.backend.entities.PaymentMethod;
import com.backend.repositories.CountryRepository;
import com.backend.repositories.PaymentMethodRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PaymentMethodService {

    @Autowired
    PaymentMethodRepository paymentMethodRepository;

    @Autowired
    CountryRepository countryRepository;

    @PostConstruct
    @Transactional
    public void initializePaymentMethodsForCountries() {
        Set<PaymentMethod> allPaymentMethods = new HashSet<>(paymentMethodRepository.findAll());

        for (Country country : countryRepository.findAll()) {
            country.setPaymentMethods(new HashSet<>(allPaymentMethods));
            countryRepository.save(country);
        }
    }
}
