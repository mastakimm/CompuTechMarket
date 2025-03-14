package com.backend.dto.customerDto;


import com.backend.entities.CustomerRole;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class RequestUpdateCustomer {
    private String email;
    private String displayName;
    private String password;
    private String address;
    private String zipcode;
    private String country;
    private String billingAddress;
    private String phoneNumber;
    private List<CustomerRole> role;
}
