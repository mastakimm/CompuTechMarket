package com.backend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jdk.jfr.BooleanFlag;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String displayName;

    @BooleanFlag
    private Boolean isVerified = false;

    @Temporal(TemporalType.TIMESTAMP)
    private Date joinDate = new Date();

    @Temporal(TemporalType.TIMESTAMP)
    private Date lastConnectionDate = new Date();

    @Temporal(TemporalType.TIMESTAMP)
    private Date jwtInvalidationDate;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<CustomerRole> roles = new ArrayList<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Token> tokens;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Collection<UserProfile> userProfile;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<HistoricOrder> historicOrders;
    private String stripeCustomerId;

    public Customer() {
        historicOrders = new ArrayList<>();
    }

    public Customer(String email, String password, String displayName) {
        this.email = email;
        this.password = password;
        this.displayName = displayName;
        this.historicOrders = new ArrayList<>();
    }

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Boolean getVerified() {
        return isVerified;
    }

    public void setVerified(Boolean verified) {
        isVerified = verified;
    }

    public Date getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(Date joinDate) {
        this.joinDate = joinDate;
    }

    public Date getLastConnectionDate() {
        return lastConnectionDate;
    }

    public void setLastConnectionDate(Date lastConnectionDate) {
        this.lastConnectionDate = lastConnectionDate;
    }

    public Date getJwtInvalidationDate() {
        return jwtInvalidationDate;
    }

    public void setJwtInvalidationDate(Date jwtInvalidationDate) {
        this.jwtInvalidationDate = jwtInvalidationDate;
    }

    public List<CustomerRole> getRoles() {
        return roles;
    }

    public void setRoles(List<CustomerRole> roles) {
        this.roles = roles;
    }

    public List<Token> getTokens() {
        return tokens;
    }

    public void setTokens(List<Token> tokens) {
        this.tokens = tokens;
    }

    public Collection<UserProfile> getUserProfile() {
        return userProfile;
    }

    public void setUserProfile(Collection<UserProfile> userProfile) {
        this.userProfile = userProfile;
    }

    public List<HistoricOrder> getHistoricOrders() {
        return historicOrders;
    }

    public void setHistoricOrders(List<HistoricOrder> historicOrders) {
        this.historicOrders = historicOrders;
    }

    public String getStripeCustomerId() {return stripeCustomerId;}

    public void setStripeCustomerId(String stripeCustomerId) {this.stripeCustomerId = stripeCustomerId;}

}
