package com.backend.repositories;

import com.backend.entities.Country;
import com.backend.entities.DeliveryFee;
import com.backend.enums.DeliveryMethod;
import com.backend.enums.DeliverySpeed;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryFeeRepository extends CrudRepository<DeliveryFee, Long> {

    void deleteByCountry(Country country);

    List<DeliveryFee> findByCountry(Country country);

    boolean existsByCountryAndDeliveryMethodAndDeliverySpeed(Country country, DeliveryMethod deliveryMethod, DeliverySpeed deliverySpeed);

    Optional<DeliveryFee> findByCountryAndDeliverySpeedAndDeliveryMethodIsNull(Country country, DeliverySpeed deliverySpeed);

    Optional<DeliveryFee> findByCountryAndDeliveryMethodAndDeliverySpeedIsNull(Country country, DeliveryMethod deliveryMethod);

    boolean existsByCountryAndDeliveryMethodAndDeliverySpeedIsNull(Country country, DeliveryMethod deliveryMethod);

    boolean existsByCountryAndDeliverySpeedAndDeliveryMethodIsNull(Country country, DeliverySpeed deliverySpeed);
}
