package com.backend.services;

import com.backend.dto.deliveryFee.CountryWithDeliveryFeesDTO;
import com.backend.dto.deliveryFee.RequestCreateCountryDTO;
import com.backend.entities.Country;
import com.backend.entities.DeliveryFee;
import com.backend.entities.PaymentMethod;
import com.backend.enums.DeliveryMethod;
import com.backend.enums.DeliverySpeed;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;
import com.backend.repositories.CountryRepository;
import com.backend.repositories.DeliveryFeeRepository;
import com.backend.repositories.PaymentMethodRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CountryService {

    @Autowired
    DeliveryFeeRepository deliveryFeeRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    public CountryService() {
    }

    public CountryWithDeliveryFeesDTO getCountryById(Long id) {
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Country not found"));

        List<DeliveryFee> deliveryFees = deliveryFeeRepository.findByCountry(country);

        CountryWithDeliveryFeesDTO dto = new CountryWithDeliveryFeesDTO();
        dto.setId(country.getId());
        dto.setName(country.getName());

        List<CountryWithDeliveryFeesDTO.DeliveryFeeDTO> feeDTOs = deliveryFees.stream()
                .map(fee -> {
                    CountryWithDeliveryFeesDTO.DeliveryFeeDTO feeDTO = new CountryWithDeliveryFeesDTO.DeliveryFeeDTO();
                    feeDTO.setDeliveryMethod(fee.getDeliveryMethod());
                    feeDTO.setDeliverySpeed(fee.getDeliverySpeed());
                    feeDTO.setFeePercentage(fee.getFeePercentage());
                    return feeDTO;
                })
                .collect(Collectors.toList());
        dto.setDeliveryFees(feeDTOs);

        List<CountryWithDeliveryFeesDTO.PaymentMethodDTO> paymentMethodDTOs = country.getPaymentMethods().stream()
                .map(pm -> new CountryWithDeliveryFeesDTO.PaymentMethodDTO(pm.getId(), pm.getName()))
                .collect(Collectors.toList());
        dto.setPaymentMethods(paymentMethodDTOs);

        return dto;
    }

    public Country getCountryByCountryName(String name) {
        Country country = countryRepository.findByName(name);

        if (country == null) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        return country;
    }

    public CountryWithDeliveryFeesDTO getCountryByName(String name) {
        Country country = countryRepository.findByName(name);

        if (country == null) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        List<DeliveryFee> deliveryFees = deliveryFeeRepository.findByCountry(country);

        CountryWithDeliveryFeesDTO dto = new CountryWithDeliveryFeesDTO();
        dto.setId(country.getId());
        dto.setName(country.getName());

        List<CountryWithDeliveryFeesDTO.DeliveryFeeDTO> feeDTOs = deliveryFees.stream()
                .map(fee -> {
                    CountryWithDeliveryFeesDTO.DeliveryFeeDTO feeDTO = new CountryWithDeliveryFeesDTO.DeliveryFeeDTO();
                    feeDTO.setDeliveryMethod(fee.getDeliveryMethod());
                    feeDTO.setDeliverySpeed(fee.getDeliverySpeed());
                    feeDTO.setFeePercentage(fee.getFeePercentage());
                    return feeDTO;
                })
                .collect(Collectors.toList());

        dto.setDeliveryFees(feeDTOs);

        List<CountryWithDeliveryFeesDTO.PaymentMethodDTO> paymentMethodDTOs = country.getPaymentMethods().stream()
                .map(pm -> new CountryWithDeliveryFeesDTO.PaymentMethodDTO(pm.getId(), pm.getName()))
                .collect(Collectors.toList());
        dto.setPaymentMethods(paymentMethodDTOs);

        return dto;
    }

    public Country createCountry(RequestCreateCountryDTO requestCreateCountryDTO) {
        Optional<Country> countryExists = Optional.ofNullable(countryRepository.findByName(requestCreateCountryDTO.getCountryName()));

        if (countryExists.isPresent()) {
            Api.Error(ErrorCode.ALREADY_EXISTS);
        }

        Country country = new Country();
        country.setName(requestCreateCountryDTO.getCountryName());

        Set<PaymentMethod> allPaymentMethods = new HashSet<>(paymentMethodRepository.findAll());
        country.setPaymentMethods(allPaymentMethods);

        countryRepository.save(country);

        initializeDeliveryFeesForCountry(country);

        return country;
    }

    public Country updateCountry(Long id, RequestCreateCountryDTO countryDTO) {
        Optional<Country> countryExists = countryRepository.findById(id);

        if (countryExists.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        Optional<Country> countryName = Optional.ofNullable(countryRepository.findByName(countryDTO.getCountryName()));

        if (countryName.isPresent()) {
            Api.Error(ErrorCode.COUNTRY_ALREADY_EXISTS);
        }

        Country country = countryExists.get();
        country.setName(countryDTO.getCountryName());

        return countryRepository.save(country);
    }

    @Transactional
    public void deleteCountry(Long countryId) {
        Country country = countryRepository.findById(countryId)
                .orElseThrow(() -> new RuntimeException("Country not found"));

        deliveryFeeRepository.deleteByCountry(country);

        countryRepository.delete(country);
    }

    private void initializeDeliveryFeesForCountry(Country country) {
        DeliveryMethod[] deliveryMethods = DeliveryMethod.values();
        DeliverySpeed[] deliverySpeeds = DeliverySpeed.values();

        for (DeliveryMethod method : deliveryMethods) {
            boolean existsMethodFee = deliveryFeeRepository.existsByCountryAndDeliveryMethodAndDeliverySpeedIsNull(country, method);
            if (!existsMethodFee) {
                DeliveryFee deliveryMethodFee = new DeliveryFee();
                deliveryMethodFee.setCountry(country);
                deliveryMethodFee.setDeliveryMethod(method);
                deliveryMethodFee.setDeliverySpeed(null);
                deliveryMethodFee.setFeePercentage("0");
                deliveryFeeRepository.save(deliveryMethodFee);
            }
        }

        for (DeliverySpeed speed : deliverySpeeds) {
            boolean existsSpeedFee = deliveryFeeRepository.existsByCountryAndDeliverySpeedAndDeliveryMethodIsNull(country, speed);
            if (!existsSpeedFee) {
                DeliveryFee deliverySpeedFee = new DeliveryFee();
                deliverySpeedFee.setCountry(country);
                deliverySpeedFee.setDeliveryMethod(null);
                deliverySpeedFee.setDeliverySpeed(speed);
                deliverySpeedFee.setFeePercentage("0");
                deliveryFeeRepository.save(deliverySpeedFee);
            }
        }
    }

    public Country getByCountryById(Long id) {
        Optional<Country> optionalCountry = countryRepository.findById(id);

        if (optionalCountry.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        return optionalCountry.get();
    }

    public Country addPaymentMethodToCountry(Long countryId, Long paymentMethodId) {
        Optional<Country> optionalCountry = countryRepository.findById(countryId);
        Optional<PaymentMethod> optionalPaymentMethod = paymentMethodRepository.findById(paymentMethodId);

        if (optionalCountry.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }
        if (optionalPaymentMethod.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        Country country = optionalCountry.get();
        PaymentMethod paymentMethod = optionalPaymentMethod.get();

        Set<PaymentMethod> paymentMethods = country.getPaymentMethods();
        paymentMethods.add(paymentMethod);

        country.setPaymentMethods(paymentMethods);

        return countryRepository.save(country);
    }

    public void deletePaymentMethodFromCountry(Long countryId, Long paymentMethodId) {
        Optional<Country> optionalCountry = countryRepository.findById(countryId);
        Optional<PaymentMethod> optionalPaymentMethod = paymentMethodRepository.findById(paymentMethodId);

        if (optionalCountry.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        if (optionalPaymentMethod.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        optionalCountry.get().getPaymentMethods().remove(optionalPaymentMethod.get());

        countryRepository.save(optionalCountry.get());
    }
}
