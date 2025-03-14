package com.backend.controllers;

import com.backend.dto.ResponseProductDto;
import com.backend.dto.component.RequestNewComponent;
import com.backend.dto.componentType.RequestNewComponentType;
import com.backend.dto.customerDto.RequestUpdateCustomer;
import com.backend.dto.deliveryFee.CountryWithDeliveryFeesDTO;
import com.backend.dto.deliveryFee.RequestCreateCountryDTO;
import com.backend.dto.deliveryFee.UpdateDeliveryFeeByMethodDTO;
import com.backend.dto.deliveryFee.UpdateDeliveryFeeBySpeedDTO;
import com.backend.dto.httpSecurityDto.RequestDto.RequestRegister;
import com.backend.dto.productSubCategoryType.RequestProductSubCategory;
import com.backend.dto.stock.StockDto;
import com.backend.entities.*;
import com.backend.entities.Customer;
import com.backend.entities.Product;
import com.backend.entities.ProductCategory;
import com.backend.entities.ProductSubCategory;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;
import com.backend.internal.PublicEndpoint;
import com.backend.repositories.*;
import com.backend.services.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private ProductService productService;

    @Autowired
    private StockService stockService;

    @Autowired
    private ProductCategoryService productCategoryService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private DeliveryFeeService deliveryFeeService;

    @Autowired
    private CountryService countryService;

    @Autowired
    private ProductSubCategoryService productSubCategoryService;

    @Autowired
    private ProductSubCategoryRepository productSubCategoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private CustomerRoleRepository customerRoleRepository;

    /*                 USER                 */
    @PublicEndpoint
    @PostMapping("customer/create")
    public void register(@Valid @RequestBody RequestRegister request) {
        customerService.addNewCustomer(request);
    }

    @PublicEndpoint
    @PatchMapping("customer/update/{id}")
    @Operation(summary = "Update a customer", description = "User can update their account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful updated the customer"),
            @ApiResponse(responseCode = "400", description = "Bad format provided"),
            @ApiResponse(responseCode = "404", description = "User with the provided ID not found", content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(mediaType = "application/json"))
    })
    public Customer updateCustomerById(@PathVariable Long id, @Valid @RequestBody RequestUpdateCustomer request, HttpServletResponse response) {
        return customerService.updateCustomerById(id, request, response);
    }


    /*              ROLES               */
    @PublicEndpoint
    @GetMapping("customer/roles")
    public List<CustomerRole> getCustomerRoles() {
        return customerRoleRepository.findAll();
    }


    //PRODUCT ADMIN

    @PublicEndpoint
    @GetMapping("/all")
    public List<ResponseProductDto> getAllComponents() {
        return productService.adminGetAll();
    }

    @PublicEndpoint
    @PostMapping("/add-component")
    public ResponseEntity<?> createComponent(@Valid @RequestBody RequestNewComponent request) {
        try {
            List<ResponseProductDto> products = productService.createComponent(request);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding component: " + e.getMessage());
        }
    }

    @PublicEndpoint
    @DeleteMapping("/delete-component/{id}")
    public void deleteComponentById(@PathVariable Long id) {
        productService.deleteById(id);
    }


    @PublicEndpoint
    @PatchMapping("/update-component/{id}")
    public List<ResponseProductDto> updateComponent(@PathVariable Long id, @RequestBody RequestNewComponent request) {
        return productService.updateComponent(id, request);
    }

    @PublicEndpoint
    @GetMapping("/component/last")
    public Product getLastAddedProduct() {
        return productRepository.findFirstByOrderByIdDesc();
    }

                /*              PRODUCT CATEGORY              */
    @PublicEndpoint
    @PostMapping("/add-component-type")
    public ProductCategory addComponentType(@RequestBody RequestNewComponentType request) {
        return productCategoryService.createComponentType(request);
    }

    @PublicEndpoint
    @PatchMapping("/updateProductCategory/{id}")
    public ProductCategory updateProductCategory(@PathVariable Long id, @RequestBody RequestNewComponentType request) {
        return productCategoryService.updateProductCategory(id, request);
    }

    @PublicEndpoint
    @DeleteMapping("/deleteProductCategory/{id}")
    public void deleteComponentTypeById(@PathVariable Long id) {
        productCategoryService.deleteById(id);
    }


                /*      PRODUCT SUB CATEGORY      */
    @PublicEndpoint
    @GetMapping("/sub-category")
    public List<ProductSubCategory> getAllSubCategories() {
        return productSubCategoryService.getAllSubCategories();
    }

    @PublicEndpoint
    @PostMapping("/sub-category")
    public ProductSubCategory createSubCategory(@RequestBody RequestProductSubCategory request) {
        return productSubCategoryService.createSubCategory(request);
    }

    @PublicEndpoint
    @GetMapping("/sub-category/{id}")
    public ProductSubCategory getSubCategoryById(@PathVariable Long id) {
        return productSubCategoryService.getSubCategoryById(id);
    }


    @PublicEndpoint
    @PatchMapping("/sub-category/{id}")
    public ProductSubCategory updateSubCategory(@PathVariable Long id, @RequestBody RequestProductSubCategory request) {
        return productSubCategoryService.updateSubCategory(id, request);
    }

    @PublicEndpoint
    @DeleteMapping("/sub-category/{id}")
    public void deleteSubCategory(@PathVariable Long id) {
        Optional<ProductSubCategory> productSubCategory = productSubCategoryRepository.findById(id);

        if (productSubCategory.isEmpty()) {
            Api.Error(ErrorCode.PRODUCT_SUB_CATEGORY_NOT_FOUND);
        }

        productSubCategoryRepository.delete(productSubCategory.get());
    }

    /*          Delivery Country         */
    @PublicEndpoint
    @PostMapping("/country/add")
    public Country createNewDeliverableCountry(@Valid @RequestBody RequestCreateCountryDTO requestCreateCountryDTO) {
        return countryService.createCountry(requestCreateCountryDTO);
    }

    @PublicEndpoint
    @GetMapping("/country")
    public List<Country> getAllDeliverableCountries() {
        return countryRepository.findAll();
    }

    @PublicEndpoint
    @GetMapping("/country/{id}")
    public CountryWithDeliveryFeesDTO getCountryById(@PathVariable Long id) {
        return countryService.getCountryById(id);
    }

    @PublicEndpoint
    @GetMapping("/country/name/{countryName}")
    public CountryWithDeliveryFeesDTO getCountryByName(@PathVariable String countryName) {
        return countryService.getCountryByName(countryName);
    }

    @PublicEndpoint
    @PutMapping("/country/{id}")
    public Country updateDeliverableCountry(@PathVariable Long id, @Valid @RequestBody RequestCreateCountryDTO requestCreateCountryDTO) {
        return countryService.updateCountry(id, requestCreateCountryDTO);
    }

    @PublicEndpoint
    @DeleteMapping("/country/{id}")
    public void deleteDeliverableCountry(@PathVariable Long id) {
        countryService.deleteCountry(id);
    }

    /*          Country Payment Methods            */
    @PublicEndpoint
    @PostMapping("/country/{countryId}/payment-method/{paymentMethodId}")
    public Country addPaymentMethodToCountry (@PathVariable Long countryId, @PathVariable Long paymentMethodId) {
        return countryService.addPaymentMethodToCountry(countryId, paymentMethodId);
    }

    @PublicEndpoint
    @DeleteMapping("/country/{countryId}/payment-method/{paymentMethodId}")
    public void removePaymentMethodFromCountry(@PathVariable Long countryId, @PathVariable Long paymentMethodId) {
        countryService.deletePaymentMethodFromCountry(countryId, paymentMethodId);
    }

    /*          Delivery Fee            */
    @PublicEndpoint
    @PutMapping("/delivery-fee/method/{id}")
    public void updateDeliveryFeeByMethod(@PathVariable Long id, @Valid @RequestBody UpdateDeliveryFeeByMethodDTO updateDeliveryFeeByMethodDTO) {
        deliveryFeeService.updateFeePercentageForDeliveryMethod(id, updateDeliveryFeeByMethodDTO);
    }

    @PublicEndpoint
    @PutMapping("/delivery-fee/speed/{id}")
    public void updateDeliveryFeeBySpeed(@PathVariable Long id, @Valid @RequestBody UpdateDeliveryFeeBySpeedDTO updateDeliveryFeeBySpeedDTO) {
        deliveryFeeService.updateFeePercentageForDeliverySpeed(id, updateDeliveryFeeBySpeedDTO);
    }


    /*              Stock Management            */
    @PublicEndpoint
    @GetMapping("/stocks")
    public List<Stock> getAllStocks() {
        return stockService.getAllStocks();
    }

    @PublicEndpoint
    @GetMapping("/stocks/{id}")
    public Stock getStockById(@PathVariable Long id) {
        Optional<Stock> stock = stockService.getStockById(id);
        if (stock.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        return stock.get();
    }

    @PublicEndpoint
    @GetMapping("/products/stocks")
    public List<Product> getAllProductsWithStocks() {
        return productRepository.findAll();
    }

    @PublicEndpoint
    @PostMapping("/stocks")
    public Stock createStock(@RequestBody @Valid StockDto stock) {
        return stockService.createStock(stock);
    }

    @PublicEndpoint
    @PutMapping("/stocks/{id}")
    public Stock updateStock(@PathVariable Long id, @RequestBody @Valid StockDto stockDetails) {
        return stockService.updateStock(id, stockDetails);
    }

    @PublicEndpoint
    @DeleteMapping("/stocks/{id}")
    public void deleteStock(@PathVariable Long id) {
        stockService.deleteStock(id);
    }

    @PublicEndpoint
    @GetMapping("/stocks/{productId}/refill-history")
    public List<Stock> getRefillHistoryByProduct(@PathVariable Long productId) {
        return stockService.getRefillHistoryByProduct(productId);
    }

    @PublicEndpoint
    @GetMapping("stocks/{productId}/oldest-stock")
    public Optional<Stock> getOldestStockEntryByProduct(@PathVariable Long productId) {
        return stockService.getOldestStockEntryByProduct(productId);
    }
}

