package com.backend.dto.httpSecurityDto.ResponseDto;

import com.backend.internal.DTO;

import java.util.List;

@DTO
public class ResponseCustomerDetails {

    private String email;
    private List<String> roles;
    private Long joinDate;
    private Long lastConnectionDate;

    // Default constructor
    public ResponseCustomerDetails() {}

    // Parameterized constructor
    public ResponseCustomerDetails(String email, List<String> roles, Long joinDate, Long lastConnectionDate) {
        this.email = email;
        this.roles = roles;
        this.joinDate = joinDate;
        this.lastConnectionDate = lastConnectionDate;
    }

    // Getters and setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public Long getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(Long joinDate) {
        this.joinDate = joinDate;
    }

    public Long getLastConnectionDate() {
        return lastConnectionDate;
    }

    public void setLastConnectionDate(Long lastConnectionDate) {
        this.lastConnectionDate = lastConnectionDate;
    }
}
