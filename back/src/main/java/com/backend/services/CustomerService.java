package com.backend.services;

import com.backend.dto.customerDto.RequestUpdateCustomer;
import com.backend.dto.httpSecurityDto.RequestDto.RequestPasswordChange;
import com.backend.dto.httpSecurityDto.RequestDto.RequestRegister;
import com.backend.dto.httpSecurityDto.ResponseDto.ResponseCustomerDetails;
import com.backend.entities.Customer;
import com.backend.entities.CustomerRole;
import com.backend.entities.Token;
import com.backend.entities.UserProfile;
import com.backend.internal.Api;
import com.backend.internal.Context;
import com.backend.internal.ErrorCode;
import com.backend.repositories.CustomerRepository;
import com.backend.repositories.CustomerRoleRepository;
import com.backend.repositories.TokenRepository;
import com.backend.repositories.UserProfileRepository;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    @Autowired
    private HttpSecurityService httpSecurityService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder bcrypt;

    @Autowired
    private CustomerRoleRepository customerRoleRepository;

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }
    public ResponseCustomerDetails getCustomerDetails() {
        Customer customer = currentCustomer();

        return new ResponseCustomerDetails(
                customer.getEmail(),
                customer.getRoles().stream().map(role -> role.getName()).collect(Collectors.toList()),
                customer.getJoinDate().getTime(),
                customer.getLastConnectionDate() != null ? customer.getLastConnectionDate().getTime() : null
        );
    }

    public void changePassword(RequestPasswordChange request, HttpServletResponse response) {
        try {
            Customer customer = currentCustomer();

            if (customer.getPassword() == null) {
                Api.Error(ErrorCode.INTERNAL_SERVER_ERROR, "Current password is null");
            }

            if (!bcrypt.matches(request.getOldPassword(), customer.getPassword())) {
                Api.Error(ErrorCode.OLD_PASSWORD_INCORRECT);
            }

            customer.setPassword(bcrypt.encode(request.getNewPassword()));
            customer.setJwtInvalidationDate(Date.from(Instant.now().minusSeconds(1)));
            httpSecurityService.generateTokenAndAssignCookie(customer.getEmail(), response);
            customerRepository.save(customer);
        } catch (Exception e) {
            System.out.println(e);
            Api.Error(ErrorCode.INTERNAL_SERVER_ERROR, "Unexpected error during password change");
        }
    }

    public void killWebSessions(HttpServletResponse response) {
        Customer customer = currentCustomer();

        customer.setJwtInvalidationDate(new Date());
        customerRepository.save(customer);

        Api.Error(ErrorCode.AUTHENTICATION_REQUIRED);
    }

    public void updateLastConnectionDate(String email) {
        Customer customer = customerRepository.findByEmail(email);
        if (customer == null) {
            Api.Error(ErrorCode.USER_NOT_FOUND);
        }

        customer.setLastConnectionDate(new Date());
        customerRepository.save(customer);
    }

    public void updateJwtInvalidationDate(String email) {
        Customer customer = customerRepository.findByEmail(email);
        if (customer == null) {
            Api.Error(ErrorCode.USER_NOT_FOUND);
        }

        customer.setJwtInvalidationDate(null);
    }

    public Customer currentCustomer() {
        String email = Context.currentUserEmail();
        Customer customer = customerRepository.findByEmail(email);
        if (customer == null) {
            Api.Error(ErrorCode.USER_NOT_FOUND);
        }
        return customer;
    }

    public Customer addNewCustomer(RequestRegister request) {
        if (customerRepository.findByEmail(request.getEmail()) != null) {
            Api.Error(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        Customer customer = new Customer();

        String password = bcrypt.encode(request.getPassword());
        customer.setEmail(request.getEmail());
        customer.setDisplayName(request.getDisplayName());
        customer.setPassword(password);
        customer.setVerified(true);

        return customerRepository.save(customer);
    }

    public Customer updateCustomerById(Long id, RequestUpdateCustomer request, HttpServletResponse response) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
        String oldEmail = customer.getEmail();

        Customer existingCustomerWithEmail = customerRepository.findByEmail(request.getEmail());
        if (existingCustomerWithEmail != null && !existingCustomerWithEmail.getId().equals(id)) {
            Api.Error(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        if (request.getEmail() != null && !request.getEmail().isEmpty() && !Objects.equals(request.getEmail(), oldEmail)) {
            customer.setEmail(request.getEmail());

            String otp = httpSecurityService.generateRandomOtp();
            LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(15);
            Token token = new Token();
            token.setOtp(otp);
            token.setCustomer(customer);
            token.setExpirationTime(expirationTime);
            tokenRepository.save(token);

            String newEmail = request.getEmail();
            String subject = "Email validation";
            String text = "Your OTP is: " + otp;

            customer.setVerified(false);
            emailService.sendSimpleMessage(newEmail, subject, text);
            emailService.sendSimpleMessage(oldEmail, subject, text);

            httpSecurityService.invalidateCookie(response);
        }

        if (request.getDisplayName() != null && !request.getDisplayName().isEmpty()) {
            customer.setDisplayName(request.getDisplayName());
        }

        if (request.getRole() != null && !request.getRole().isEmpty()) {
            List<CustomerRole> roles = new ArrayList<>();

            for (CustomerRole roleData : request.getRole()) {
                String roleName = roleData.getName();
                CustomerRole role = customerRoleRepository.findByName(roleName);

                if (role != null) {
                    roles.add(role);
                } else {
                    throw new RuntimeException("Role " + roleName + " does not exist.");
                }
            }

            customer.setRoles(roles);
        }

        UserProfile userProfile = customer.getUserProfile().stream().findFirst().orElse(new UserProfile());
        userProfile.setCustomer(customer);

        if (request.getAddress() != null && !request.getAddress().isEmpty()) {
            userProfile.setAddress(request.getAddress());
        }
        if (request.getZipcode() != null && !request.getZipcode().isEmpty()) {
            userProfile.setZipcode(request.getZipcode());
        }
        if (request.getCountry() != null && !request.getCountry().isEmpty()) {
            userProfile.setCountry(request.getCountry());
        }
        if (request.getBillingAddress() != null && !request.getBillingAddress().isEmpty()) {
            userProfile.setBilling_address(request.getBillingAddress());
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty()) {
            userProfile.setPhone_number(request.getPhoneNumber());
        }

        userProfileRepository.save(userProfile);
        return customerRepository.save(customer);
    }


    @Transactional
    public Customer updateCustomer(RequestUpdateCustomer request, HttpServletResponse response) {
        Customer customer = currentCustomer();
        String oldEmail = customer.getEmail();

        if (customerRepository.findByEmail(request.getEmail()) != null && !Objects.equals(oldEmail, request.getEmail())) {
            Api.Error(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        /*          Customer        */
        if (request.getEmail() != null && !request.getEmail().isEmpty() && !Objects.equals(request.getEmail(), oldEmail)) {
            customer.setEmail(request.getEmail());

            String otp = httpSecurityService.generateRandomOtp();
            LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(15);
            Token token = new Token();
            token.setOtp(otp);
            token.setCustomer(customer);
            token.setExpirationTime(expirationTime);
            tokenRepository.save(token);

            String newEmail = request.getEmail();
            String subject = "Email validation";
            String text = "Your OTP is: " + otp;

            customer.setVerified(false);
            emailService.sendSimpleMessage(newEmail, subject, text);
            emailService.sendSimpleMessage(oldEmail, subject, text);

            httpSecurityService.invalidateCookie(response);
        }
        if (request.getDisplayName() != null && !request.getDisplayName().isEmpty() && !Objects.equals(request.getDisplayName(), oldEmail)) {
            customer.setDisplayName(request.getDisplayName());
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty() && !Objects.equals(request.getPassword(), oldEmail)) {
            customer.setPassword(bcrypt.encode(request.getPassword()));
        }

        /*          Customer Profile        */
        UserProfile userProfile = customer.getUserProfile().stream().findFirst().orElse(new UserProfile());
        userProfile.setCustomer(customer);

        if (request.getAddress() != null && !request.getAddress().isEmpty() && !Objects.equals(request.getAddress(), userProfile.getAddress())) {
            userProfile.setAddress(request.getAddress());
        }
        if (request.getZipcode() != null && !request.getZipcode().isEmpty() && !Objects.equals(request.getZipcode(), userProfile.getZipcode())) {
            userProfile.setZipcode(request.getZipcode());
        }
        if (request.getCountry() != null && !request.getCountry().isEmpty() && !Objects.equals(request.getCountry(), userProfile.getCountry())) {
            userProfile.setCountry(request.getCountry());
        }
        if (request.getBillingAddress() != null && !request.getBillingAddress().isEmpty() && !request.getBillingAddress().equals(userProfile.getBilling_address())) {
            userProfile.setBilling_address(request.getBillingAddress());
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isEmpty() && !Objects.equals(request.getPhoneNumber(), userProfile.getPhone_number())) {
            userProfile.setPhone_number(request.getPhoneNumber());
        }

        userProfileRepository.save(userProfile);
        return customerRepository.save(customer);
    }
}
