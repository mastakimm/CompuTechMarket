package com.backend.controllers;

import com.backend.dto.customerDto.RequestUpdateCustomer;
import com.backend.dto.httpSecurityDto.RequestDto.RequestPasswordChange;
import com.backend.dto.httpSecurityDto.RequestDto.RequestRegister;
import com.backend.entities.Customer;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;
import com.backend.internal.PublicEndpoint;
import com.backend.repositories.CustomerRepository;
import com.backend.services.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/customer")
@Tag(name = "Customer", description = "Customer Management")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerService customerService;

    @PublicEndpoint
    @GetMapping("/")
    @Operation(summary = "Get the authenticated customer", description = "Get the authenticated customer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful retrieval of the authenticated customer"),
            @ApiResponse(responseCode = "404", description = "There is no customer authenticated", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json"))
    })
    public Customer getCurrentCustomer() {
        return customerService.currentCustomer();
    }


    @PublicEndpoint
    @GetMapping()
    @Operation(summary = "Get all customers", description = "Get the list of all customers")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful retrieval of customers list"),
            @ApiResponse(responseCode = "404", description = "There is no customer", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json"))
    })
    public List<Customer> getAllCustomers() {
        return (List<Customer>) customerRepository.findAll();
    }

    @PublicEndpoint
    @GetMapping("/{id}")
    @Operation(summary = "Get customer details", description = "Get the details of the currently authenticated customer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful retrieval of customer details"),
            @ApiResponse(responseCode = "404", description = "Customer not found", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json"))
    })
    public Optional<Customer> getCustomerById(@PathVariable Long id) {
        Optional<Customer> customer = customerRepository.findById(id);

        if (customer.isEmpty()) {
            Api.Error(ErrorCode.USER_NOT_FOUND);
        }

        return customer;
    }

    @PublicEndpoint
    @PostMapping("/add")
    @Operation(summary = "Create a new customer", description = "Admin can create a new customer from admin panel")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful created the customer"),
            @ApiResponse(responseCode = "400", description = "VALIDATION FAILED", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "409", description = "Conflict: Email already used", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json"))
    })
    public Customer addCustomer(@Valid @RequestBody RequestRegister requestRegister) {
        return customerService.addNewCustomer(requestRegister);
    }

    @PublicEndpoint
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a customer", description = "Admin can delete a customer from admin panel")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful deleted the customer"),
            @ApiResponse(responseCode = "404", description = "User with the provided ID not found", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json"))
    })
    public void deleteCustomerById(@PathVariable Long id) {
        Optional<Customer> customer = customerRepository.findById(id);

        if (customer.isEmpty()) {
            Api.Error(ErrorCode.USER_NOT_FOUND);
        }

        customerRepository.delete(customer.get());
    }




    /*                          ERROR HANDLING MISSING HERE                         */

    /*      Update a customer by it's ID        */
    @PublicEndpoint
    @PatchMapping("/update")
    @Operation(summary = "Update a customer", description = "User can update their account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful updated the customer"),
            @ApiResponse(responseCode = "400", description = "Bad format provided"),
            @ApiResponse(responseCode = "404", description = "User with the provided ID not found", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json"))
    })
    public Customer updateCurrentCustomer(@Valid @RequestBody RequestUpdateCustomer request, HttpServletResponse response) {
        return customerService.updateCustomer(request, response);
    }

    @PublicEndpoint
    @PatchMapping("/password")
    @Operation(summary = "Update a customer password", description = "User can update their password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful updated the customer"),
            @ApiResponse(responseCode = "400", description = "Bad format provided"),
            @ApiResponse(responseCode = "404", description = "User with the provided ID not found", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json"))
    })
    public void updateCustomerPassword(@Valid @RequestBody RequestPasswordChange requestPasswordChange, HttpServletResponse response) {
        customerService.changePassword(requestPasswordChange, response);
    }
}
