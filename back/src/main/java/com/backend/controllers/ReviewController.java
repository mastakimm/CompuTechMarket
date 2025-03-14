package com.backend.controllers;

import com.backend.dto.review.ReviewRequestDto;
import com.backend.dto.review.ReviewResponseDto;
import com.backend.entities.Review;
import com.backend.internal.PublicEndpoint;
import com.backend.services.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @PublicEndpoint
    @PostMapping("/add")
    public Review addReview(@Valid @RequestBody ReviewRequestDto reviewRequest) {
        return reviewService.addReview(reviewRequest);
    }
    
    @PublicEndpoint
    @GetMapping("/{productId}")
    public List<ReviewResponseDto> getReviewsByProductId(@PathVariable Long productId) {
        return reviewService.getReviewsByProductId(productId);
    }


}
