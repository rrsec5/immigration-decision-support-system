package com.example.countryservice.controller;

import com.example.countryservice.dto.ReviewDto;
import com.example.countryservice.dto.ReviewRequest;
import com.example.countryservice.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * GET /api/reviews/{countryId}
     * Reviews for country. Sort parameter: newest (default) | best | worst.
     * Available to everyone.
     */
    @GetMapping("/{countryId}")
    public ResponseEntity<List<ReviewDto>> getReviews(
            @PathVariable Integer countryId,
            @RequestParam(required = false, defaultValue = "newest") String sort) {
        return ResponseEntity.ok(reviewService.getReviewsForCountry(countryId, sort));
    }

    /**
     * POST /api/reviews/{countryId}
     * Add a review. The userId is passed in the X-User-Id header (set by the gateway/frontend).
     */
    @PostMapping("/{countryId}")
    public ResponseEntity<ReviewDto> addReview(
            @PathVariable Integer countryId,
            @RequestHeader("X-User-Id") Integer userId,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.addReview(userId, countryId, request));
    }

    /**
     * PUT /api/reviews/{countryId}
     * Update your review.
     */
    @PutMapping("/{countryId}")
    public ResponseEntity<ReviewDto> updateReview(
            @PathVariable Integer countryId,
            @RequestHeader("X-User-Id") Integer userId,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(reviewService.updateReview(userId, countryId, request));
    }

    /**
     * DELETE /api/reviews/{countryId}
     * Delete your review.
     */
    @DeleteMapping("/{countryId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Integer countryId,
            @RequestHeader("X-User-Id") Integer userId) {
        reviewService.deleteReview(userId, countryId);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/reviews/{countryId}/my
     * Check if the user has left a review for a given country.
     */
    @GetMapping("/{countryId}/my")
    public ResponseEntity<Boolean> hasMyReview(
            @PathVariable Integer countryId,
            @RequestHeader("X-User-Id") Integer userId) {
        return ResponseEntity.ok(reviewService.hasUserReviewedCountry(userId, countryId));
    }
}