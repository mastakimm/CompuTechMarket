package com.backend.repositories;

import com.backend.entities.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    List<UserProfile> findByCustomerId(Long customerId);

    @Modifying
    @Query("UPDATE UserProfile u SET u.isActive = false WHERE u.customer.id = :customerId AND u.isActive = true")
    void deactivateOtherProfiles(@Param("customerId") Long customerId);
}
