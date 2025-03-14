package com.backend.dto.customerDto;

public class SimpleCustomerDto {
    private Long id;  // Ajout de l'ID
    private String email;
    private String displayName;

    // Constructeur avec arguments
    public SimpleCustomerDto(Long id, String email, String displayName) {
        this.id = id;
        this.email = email;
        this.displayName = displayName;
    }

    public SimpleCustomerDto() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
