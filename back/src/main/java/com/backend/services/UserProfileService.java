package com.backend.services;

import com.backend.dto.userProfileDTO.RequestUserProfileDTO;
import com.backend.entities.Customer;
import com.backend.entities.UserProfile;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;
import com.backend.repositories.CustomerRepository;
import com.backend.repositories.UserProfileRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Transactional
    public List<UserProfile> createUserProfile(Long customerId, RequestUserProfileDTO userProfileDTO) {
        Optional<Customer> optionalCustomer = customerRepository.findById(customerId);

        if (optionalCustomer.isEmpty()) {
            Api.Error(ErrorCode.CUSTOMER_NOT_FOUND);
            return null;
        }

        userProfileRepository.deactivateOtherProfiles(customerId);

        UserProfile newUserProfile = new UserProfile();
        newUserProfile.setCustomer(optionalCustomer.get());
        newUserProfile.setAddress(userProfileDTO.getAddress());
        newUserProfile.setBilling_address(userProfileDTO.getBilling_address());
        newUserProfile.setCountry(userProfileDTO.getCountry());
        newUserProfile.setPhone_number(userProfileDTO.getPhone_number());
        newUserProfile.setZipcode(userProfileDTO.getZipcode());
        newUserProfile.setCity(userProfileDTO.getCity());
        newUserProfile.setFirstname(userProfileDTO.getFirstname());
        newUserProfile.setLastname(userProfileDTO.getLastname());
        newUserProfile.setIsActive(true);

        userProfileRepository.save(newUserProfile);

        return userProfileRepository.findByCustomerId(customerId);
    }

    @Transactional
    public List<UserProfile> updateUserProfile(Long customerId, Long userProfileId, RequestUserProfileDTO userProfileDTO) {
        Optional<Customer> customer = customerRepository.findById(customerId);

        if (customer.isEmpty()) {
            Api.Error(ErrorCode.CUSTOMER_NOT_FOUND);
        }

        Optional<UserProfile> optionalUserProfile = userProfileRepository.findById(userProfileId);

        if (optionalUserProfile.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        UserProfile userProfile = optionalUserProfile.get();

        userProfile.setAddress(userProfileDTO.getAddress());
        userProfile.setBilling_address(userProfileDTO.getBilling_address());
        userProfile.setCountry(userProfileDTO.getCountry());
        userProfile.setPhone_number(userProfileDTO.getPhone_number());
        userProfile.setZipcode(userProfileDTO.getZipcode());
        userProfile.setCity(userProfileDTO.getCity());
        userProfile.setFirstname(userProfileDTO.getFirstname());
        userProfile.setLastname(userProfileDTO.getLastname());

        if (Boolean.TRUE.equals(userProfileDTO.getIsActive())) {
            userProfileRepository.deactivateOtherProfiles(customerId);
        }

        userProfile.setIsActive(userProfileDTO.getIsActive());

        userProfileRepository.save(userProfile);

        return userProfileRepository.findByCustomerId(customerId);
    }

    public List<UserProfile> getAllUserProfiles(Long customerId) {
        Customer customer = (Customer) userProfileRepository.findByCustomerId(customerId);

        if (customer == null) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        return new ArrayList<>(customer.getUserProfile());
    }
}
