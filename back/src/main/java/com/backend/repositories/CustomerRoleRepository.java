package com.backend.repositories;

import com.backend.entities.CustomerRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRoleRepository extends JpaRepository<CustomerRole, Long> {
    CustomerRole findByName(String name);
}
