package com.example.countryservice.service;

import com.example.countryservice.dto.ReviewRequest;
import com.example.countryservice.entity.Review;
import com.example.countryservice.entity.ReviewId;
import com.example.countryservice.repository.ReviewRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private CountryService countryService;

    @InjectMocks
    private ReviewService reviewService;

    @Test
    void shouldAddReviewSuccessfully() {

        ReviewRequest request = new ReviewRequest();
        request.setRating(BigDecimal.valueOf(9));
        request.setComment("Great country");


        when(reviewRepository.existsByIdUserIdAndIdCountryId(1, 10))
                .thenReturn(false);

        var result =
                reviewService.addReview(1, 10, request);

        assertEquals(1, result.getUserId());
        assertEquals(10, result.getCountryId());
        assertEquals(
                BigDecimal.valueOf(9),
                result.getRating()
        );

        verify(reviewRepository)
                .save(any(Review.class));

        verify(countryService)
                .update_country_scores(10);
    }


    @Test
    void shouldThrowExceptionWhenUserAlreadyReviewedCountry() {

        ReviewRequest request = new ReviewRequest();
        request.setRating(BigDecimal.valueOf(8));

        when(reviewRepository.existsByIdUserIdAndIdCountryId(1, 10))
                .thenReturn(true);


        assertThrows(
                IllegalStateException.class,
                () -> reviewService.addReview(1, 10, request)
        );

        verify(reviewRepository, never())
                .save(any());
    }


    @Test
    void shouldUpdateReviewSuccessfully() {

        ReviewId id = new ReviewId(1, 10);

        Review review = new Review();
        review.setId(id);
        review.setRating(BigDecimal.valueOf(5));
        review.setComment("Old");

        when(reviewRepository.findById(id))
                .thenReturn(Optional.of(review));

        ReviewRequest request = new ReviewRequest();
        request.setRating(BigDecimal.valueOf(9));
        request.setComment("Updated");


        var result =
                reviewService.updateReview(1, 10, request);


        assertEquals(
                BigDecimal.valueOf(9),
                result.getRating()
        );

        assertEquals(
                "Updated",
                result.getComment()
        );

        verify(reviewRepository)
                .save(review);

        verify(countryService)
                .update_country_scores(10);
    }


    @Test
    void shouldDeleteReviewSuccessfully() {

        ReviewId id = new ReviewId(1, 10);

        when(reviewRepository.existsById(id))
                .thenReturn(true);


        reviewService.deleteReview(1, 10);

        verify(reviewRepository)
                .deleteById(id);

        verify(countryService)
                .update_country_scores(10);
    }

    @Test
    void shouldReturnReviewsSortedByBestRating() {

        Review first = new Review();
        first.setId(new ReviewId(1, 10));
        first.setRating(BigDecimal.valueOf(5));

        Review second = new Review();
        second.setId(new ReviewId(2, 10));
        second.setRating(BigDecimal.valueOf(9));

        when(reviewRepository.findByIdCountryId(10))
                .thenReturn(List.of(first, second));

        var result =
                reviewService.getReviewsForCountry(10, "best");

        assertEquals(
                BigDecimal.valueOf(9),
                result.get(0).getRating()
        );

        assertEquals(
                BigDecimal.valueOf(5),
                result.get(1).getRating()
        );
    }
}
