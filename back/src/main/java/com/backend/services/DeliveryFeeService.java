package com.backend.services;

import com.backend.dto.deliveryFee.UpdateDeliveryFeeByMethodDTO;
import com.backend.dto.deliveryFee.UpdateDeliveryFeeBySpeedDTO;
import com.backend.entities.Country;
import com.backend.entities.DeliveryFee;
import com.backend.enums.DeliveryMethod;
import com.backend.enums.DeliverySpeed;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;
import com.backend.repositories.CountryRepository;
import com.backend.repositories.DeliveryFeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class DeliveryFeeService {

    @Autowired
    private DeliveryFeeRepository deliveryFeeRepository;

    @Autowired
    private CountryRepository countryRepository;

    public void initializeDeliveryFeesForAllCountries() {
        List<Country> countries = (List<Country>) countryRepository.findAll();

        DeliveryMethod[] deliveryMethods = DeliveryMethod.values();
        DeliverySpeed[] deliverySpeeds = DeliverySpeed.values();

        for (Country country : countries) {
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
    }

    /**
     * Update the delivery fee for a specific country and a specific Speed.
     */
    public void updateFeePercentageForDeliverySpeed(Long id, UpdateDeliveryFeeBySpeedDTO updateDeliveryFeeBySpeedDTO) {
        Country country = countryRepository.findById(id)
                .orElseThrow();

        Optional<DeliveryFee> feeOptional = deliveryFeeRepository.findByCountryAndDeliverySpeedAndDeliveryMethodIsNull(country, updateDeliveryFeeBySpeedDTO.getDeliverySpeed());

        if (feeOptional.isPresent()) {
            DeliveryFee fee = feeOptional.get();
            fee.setFeePercentage(updateDeliveryFeeBySpeedDTO.getFeePercentage());
            deliveryFeeRepository.save(fee);
        } else {
            Api.Error(ErrorCode.NOT_FOUND);
        }
    }

    /**
     * Update the delivery fee for a specific country and a specific method.
     */
    public void updateFeePercentageForDeliveryMethod(Long id, UpdateDeliveryFeeByMethodDTO updateDeliveryFeeByMethodDTO) {
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Country not found"));

        Optional<DeliveryFee> feeOptional = deliveryFeeRepository.findByCountryAndDeliveryMethodAndDeliverySpeedIsNull(country, updateDeliveryFeeByMethodDTO.getDeliveryMethod());

        if (feeOptional.isPresent()) {
            DeliveryFee fee = feeOptional.get();
            fee.setFeePercentage(updateDeliveryFeeByMethodDTO.getFeePercentage());
            deliveryFeeRepository.save(fee);
        } else {
            Api.Error(ErrorCode.NOT_FOUND);
        }
    }
}
