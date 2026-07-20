package com.example.countryservice.service;

import com.example.countryservice.entity.Country;
import com.example.countryservice.entity.Review;
import com.example.countryservice.repository.CountryRepository;
import com.example.countryservice.repository.ReviewRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;



@ExtendWith(MockitoExtension.class)
public class CountryServiceTest {

    @Mock
    private CountryRepository countryRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private CountryService countryService;

    @Test
    void shouldCalculateAverageUserScore() {

        Review review1 = new Review();
        review1.setRating(BigDecimal.valueOf(9));

        Review review2 = new Review();
        review2.setRating(BigDecimal.valueOf(8));

        Review review3 = new Review();
        review3.setRating(BigDecimal.valueOf(7));

        when(reviewRepository.findByIdCountryId(1))
                .thenReturn(List.of(review1, review2, review3));

        BigDecimal result = countryService.calculate_user_score(1);

        assertEquals(0, BigDecimal.valueOf(8.0).compareTo(result));
    }

    @Test
    void shouldReturnZeroWhenCountryHasNoReviews() {

        when(reviewRepository.findByIdCountryId(1))
                .thenReturn(List.of());

        BigDecimal result = countryService.calculate_user_score(1);

        assertEquals(BigDecimal.ZERO, result);
    }

    @Test
    void shouldCalculateOverallScoreWithUserRating() {

        Country country = new Country();

        country.setEconomyIndex(BigDecimal.valueOf(8));
        country.setQualityOfLife(BigDecimal.valueOf(9));
        country.setSafetyLevel(BigDecimal.valueOf(7));

        country.setEducationLevel(BigDecimal.valueOf(8));
        country.setHealthcareLevel(BigDecimal.valueOf(9));
        country.setEmploymentOpportunities(BigDecimal.valueOf(7));
        country.setImmigrationPolicy(BigDecimal.valueOf(6));
        country.setSocialInstitutions(BigDecimal.valueOf(8));

        country.setUserRating(BigDecimal.valueOf(9));


        BigDecimal result = countryService.calculate_overall_score(country);


        assertEquals(
                BigDecimal.valueOf(8.0),
                result
        );
    }


    @Test
    void shouldCalculateOverallScoreWithoutUserRating() {

        Country country = new Country();

        country.setEconomyIndex(BigDecimal.valueOf(8));
        country.setQualityOfLife(BigDecimal.valueOf(9));
        country.setSafetyLevel(BigDecimal.valueOf(7));

        country.setEducationLevel(BigDecimal.valueOf(8));
        country.setHealthcareLevel(BigDecimal.valueOf(9));
        country.setEmploymentOpportunities(BigDecimal.valueOf(7));
        country.setImmigrationPolicy(BigDecimal.valueOf(6));
        country.setSocialInstitutions(BigDecimal.valueOf(8));

        country.setUserRating(BigDecimal.ZERO);

        BigDecimal result =
                countryService.calculate_overall_score(country);

        assertEquals(
                BigDecimal.valueOf(7.9),
                result
        );
    }

    @Test
    void shouldUpdateCountryScores() {

        Country country = new Country();
        country.setId(1);

        country.setEconomyIndex(BigDecimal.valueOf(8));
        country.setQualityOfLife(BigDecimal.valueOf(9));
        country.setSafetyLevel(BigDecimal.valueOf(7));
        country.setEducationLevel(BigDecimal.valueOf(8));
        country.setHealthcareLevel(BigDecimal.valueOf(9));
        country.setEmploymentOpportunities(BigDecimal.valueOf(7));
        country.setImmigrationPolicy(BigDecimal.valueOf(6));
        country.setSocialInstitutions(BigDecimal.valueOf(8));

        when(countryRepository.findById(1))
                .thenReturn(Optional.of(country));


        when(reviewRepository.findByIdCountryId(1))
                .thenReturn(List.of());


        countryService.update_country_scores(1);

        assertEquals(
                BigDecimal.ZERO,
                country.getUserRating()
        );

        assertEquals(
                BigDecimal.valueOf(7.9),
                country.getOverallRating()
        );

        verify(countryRepository)
                .save(country);
    }
}
