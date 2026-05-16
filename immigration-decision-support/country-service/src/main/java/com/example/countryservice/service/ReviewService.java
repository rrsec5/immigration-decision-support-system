package com.example.countryservice.service;

import com.example.countryservice.dto.ReviewDto;
import com.example.countryservice.dto.ReviewRequest;
import com.example.countryservice.entity.Review;
import com.example.countryservice.entity.ReviewId;
import com.example.countryservice.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CountryService countryService;

    // -----------------------------------------------------------------------
    // After saving the review, update the country data via update_country_scores
    // -----------------------------------------------------------------------
    @Transactional
    public ReviewDto addReview(Integer userId, Integer countryId, ReviewRequest request) {
        if (reviewRepository.existsByIdUserIdAndIdCountryId(userId, countryId)) {
            throw new IllegalStateException("User already has a review for this country");
        }

        Review review = new Review();
        review.setId(new ReviewId(userId, countryId));
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        reviewRepository.save(review);

        countryService.update_country_scores(countryId);

        return ReviewDto.from(review);
    }

    // -----------------------------------------------------------------------
    // After updating the review, update the country data via update_country_scores
    // -----------------------------------------------------------------------
    @Transactional
    public ReviewDto updateReview(Integer userId, Integer countryId, ReviewRequest request) {
        Review review = reviewRepository.findById(new ReviewId(userId, countryId))
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        reviewRepository.save(review);

        countryService.update_country_scores(countryId);

        return ReviewDto.from(review);
    }

    // -----------------------------------------------------------------------
    // After deleting a review, update country data via update_country_scores
    // -----------------------------------------------------------------------
    @Transactional
    public void deleteReview(Integer userId, Integer countryId) {
        ReviewId reviewId = new ReviewId(userId, countryId);
        if (!reviewRepository.existsById(reviewId)) {
            throw new IllegalArgumentException("Review not found");
        }
        reviewRepository.deleteById(reviewId);

        countryService.update_country_scores(countryId);
    }

    public List<ReviewDto> getReviewsForCountry(Integer countryId, String sort) {
        List<Review> reviews = reviewRepository.findByIdCountryId(countryId);

        Comparator<Review> comparator = switch (sort == null ? "newest" : sort) {
            case "best"   -> Comparator.comparing(Review::getRating).reversed();
            case "worst"  -> Comparator.comparing(Review::getRating);
            default       -> Comparator.comparing(Review::getCreatedAt).reversed(); // newest
        };

        return reviews.stream()
                .sorted(comparator)
                .map(ReviewDto::from)
                .collect(Collectors.toList());
    }

    public boolean hasUserReviewedCountry(Integer userId, Integer countryId) {
        return reviewRepository.existsByIdUserIdAndIdCountryId(userId, countryId);
    }
}