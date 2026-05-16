package com.example.countryservice.service;

import com.example.countryservice.dto.CountryDto;
import com.example.countryservice.entity.Country;
import com.example.countryservice.repository.CountryRepository;
import com.example.countryservice.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CountryService {

    private final CountryRepository countryRepository;
    private final ReviewRepository reviewRepository;

    // -----------------------------------------------------------------------
    // AVG(rating) from the review table for a given country, or 0
    // -----------------------------------------------------------------------
    public BigDecimal calculate_user_score(Integer countryId) {
        List<com.example.countryservice.entity.Review> reviews =
                reviewRepository.findByIdCountryId(countryId);

        if (reviews.isEmpty()) return BigDecimal.ZERO;

        BigDecimal sum = reviews.stream()
                .map(com.example.countryservice.entity.Review::getRating)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return sum.divide(BigDecimal.valueOf(reviews.size()), 1, RoundingMode.HALF_UP);
    }

    // -----------------------------------------------------------------------
    // Calculates the overall rating of a country.
    // If there are no reviews, they are not included in the calculations.
    // -----------------------------------------------------------------------
    public BigDecimal calculate_overall_score(Country c) {
        BigDecimal ur = c.getUserRating();
        boolean hasUserRating = ur != null && ur.compareTo(BigDecimal.ZERO) != 0;

        BigDecimal numerator = c.getEconomyIndex().multiply(BigDecimal.valueOf(3))
                .add(c.getQualityOfLife().multiply(BigDecimal.valueOf(3)))
                .add(c.getSafetyLevel().multiply(BigDecimal.valueOf(2)))
                .add(c.getEducationLevel())
                .add(c.getHealthcareLevel())
                .add(c.getEmploymentOpportunities())
                .add(c.getImmigrationPolicy())
                .add(c.getSocialInstitutions())
                .add(hasUserRating ? ur : BigDecimal.ZERO);

        BigDecimal denominator = BigDecimal.valueOf(hasUserRating ? 14 : 13);

        return numerator.divide(denominator, 1, RoundingMode.HALF_UP);
    }

    // -----------------------------------------------------------------------
    // Updates user_rating, then overall_rating
    // -----------------------------------------------------------------------
    @Transactional
    public void update_country_scores(Integer countryId) {
        Country country = countryRepository.findById(countryId)
                .orElseThrow(() -> new IllegalArgumentException("Country not found: " + countryId));

        country.setUserRating(calculate_user_score(countryId));
        country.setOverallRating(calculate_overall_score(country));

        countryRepository.save(country);
    }

    // -----------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------

    public List<CountryDto> getAllCountries() {
        return countryRepository.findAll().stream()
                .map(CountryDto::from)
                .collect(Collectors.toList());
    }

    public List<CountryDto> getAllCountriesSorted(String sortBy, String direction) {
        Sort.Direction dir = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
        String field = resolveCountrySortField(sortBy);
        return countryRepository.findAll(Sort.by(dir, field)).stream()
                .map(CountryDto::from)
                .collect(Collectors.toList());
    }

    public CountryDto getCountryById(Integer id) {
        Country c = countryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Country not found: " + id));
        return CountryDto.from(c);
    }

    // Get the Country object for internal use (recommendation-service calls via Feign/REST)
    public Country getCountryEntityById(Integer id) {
        return countryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Country not found: " + id));
    }

    public List<Integer> getAllCountryIds() {
        return countryRepository.findAll().stream()
                .map(Country::getId)
                .collect(Collectors.toList());
    }

    private String resolveCountrySortField(String sortBy) {
        return switch (sortBy == null ? "" : sortBy) {
            case "overallRating"            -> "overallRating";
            case "userRating"               -> "userRating";
            case "costOfLiving"             -> "costOfLiving";
            case "safetyLevel"              -> "safetyLevel";
            case "qualityOfLife"            -> "qualityOfLife";
            case "educationLevel"           -> "educationLevel";
            case "healthcareLevel"          -> "healthcareLevel";
            case "employmentOpportunities"  -> "employmentOpportunities";
            case "immigrationPolicy"        -> "immigrationPolicy";
            default                         -> "overallRating";
        };
    }
}