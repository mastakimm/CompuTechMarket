package com.backend.controllers;

import com.backend.dto.userProfileDTO.RequestUserProfileDTO;
import com.backend.entities.UserProfile;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;
import com.backend.internal.PublicEndpoint;
import com.backend.repositories.UserProfileRepository;
import com.backend.services.CustomerService;
import com.backend.services.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/userProfile")
public class UserProfileController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private CustomerService customerService;

    @PublicEndpoint
    @GetMapping("/customer/{customerId}")
    public List<UserProfile> getUserProfiles(@PathVariable Long customerId) {
        return userProfileRepository.findByCustomerId(customerId);
    }

    @PublicEndpoint
    @GetMapping("/{userProfileId}")
    public Optional<UserProfile> getUserProfileById(@PathVariable Long userProfileId) {
        return userProfileRepository.findById(userProfileId);
    }

    @PublicEndpoint
    @PostMapping("/{customerId}")
    public List<UserProfile> createUserProfile(@PathVariable Long customerId, @Valid @RequestBody RequestUserProfileDTO userProfileDTO) {
        return userProfileService.createUserProfile(customerId, userProfileDTO);
    }

    @PublicEndpoint
    @PutMapping("/{customerId}/{userProfileId}")
    public List<UserProfile> updateUserProfile(@PathVariable Long customerId, @PathVariable Long userProfileId, @Valid @RequestBody RequestUserProfileDTO userProfileDTO) {
        return userProfileService.updateUserProfile(customerId, userProfileId, userProfileDTO);
    }

    @PublicEndpoint
    @DeleteMapping("/{userProfileId}")
    public void deleteUserProfile(@PathVariable Long userProfileId) {
        Optional<UserProfile> optionalUserProfile = userProfileRepository.findById(userProfileId);

        if (optionalUserProfile.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        userProfileRepository.deleteById(userProfileId);
    }
}
