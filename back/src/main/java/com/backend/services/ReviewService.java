package com.backend.services;

import com.backend.dto.customerDto.SimpleCustomerDto;
import com.backend.dto.review.ReviewRequestDto;
import com.backend.dto.review.ReviewResponseDto;
import com.backend.entities.Customer;
import com.backend.entities.Product;
import com.backend.entities.Review;
import com.backend.internal.Api;
import com.backend.internal.ErrorCode;
import com.backend.repositories.ReviewRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ProductService productService;


    public Review addReview(@Valid ReviewRequestDto reviewRequest) {
        Optional<Customer> customerOptional = customerService.getCustomerById(reviewRequest.getCustomerId());
        Optional<Product> productOptional = productService.getProductById(reviewRequest.getProductId());

        if (customerOptional.isEmpty() || productOptional.isEmpty()) {
            Api.Error(ErrorCode.NOT_FOUND);
        }

        Customer customer = customerOptional.get();
        Product product = productOptional.get();

        try{

        Review review = new Review();
        review.setCustomer(customer);
        review.setProduct(product);
        review.setReview(reviewRequest.getReview());
        review.setStars(reviewRequest.getStars());

        if(reviewRepository.save(review) == null){
            Api.Error(ErrorCode.INTERNAL_SERVER_ERROR);
        }
        return reviewRepository.save(review);

        }catch (Exception e){
            Api.Error(ErrorCode.INTERNAL_SERVER_ERROR);
            e.printStackTrace();
            return null;
        }
    }


    public List<ReviewResponseDto> getReviewsByProductId(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        return reviews.stream()
                .map(review -> {
                    SimpleCustomerDto customerDto = new SimpleCustomerDto();
                    customerDto.setEmail(review.getCustomer().getEmail());
                    customerDto.setDisplayName(review.getCustomer().getDisplayName());

                    return new ReviewResponseDto(
                            review.getId(),
                            review.getReview(),
                            review.getStars(),
                            customerDto
                    );
                })
                .collect(Collectors.toList());
    }
}
