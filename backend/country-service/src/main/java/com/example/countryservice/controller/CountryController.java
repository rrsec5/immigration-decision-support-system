package com.example.countryservice.controller;

import com.example.countryservice.dto.CountryDto;
import com.example.countryservice.dto.CountryProfessionDto;
import com.example.countryservice.entity.CountryProfession;
import com.example.countryservice.repository.CountryProfessionRepository;
import com.example.countryservice.service.CountryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/countries")
@RequiredArgsConstructor
public class CountryController {

    private final CountryService countryService;
    private final CountryProfessionRepository countryProfessionRepository;

    /**
     * GET /api/countries
     * Parameters:
     * sortBy — sort field (overallRating, userRating, costOfLiving, safetyLevel, etc.)
     * direction — asc / desc (default: desc)
     *
     * Available to everyone (guests can also view the overall rating).
     */
    @GetMapping
    public ResponseEntity<List<CountryDto>> getAllCountries(
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String direction) {

        if (sortBy != null && !sortBy.isBlank()) {
            return ResponseEntity.ok(countryService.getAllCountriesSorted(sortBy, direction));
        }
        return ResponseEntity.ok(countryService.getAllCountriesSorted("overallRating", direction));
    }

    /**
     * GET /api/countries/{id}
     * Detailed country page. Available to everyone.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CountryDto> getCountryById(@PathVariable Integer id) {
        return ResponseEntity.ok(countryService.getCountryById(id));
    }

    /**
     * GET /api/countries/ids
     * List of all country IDs - using by recommendation-service.
     */
    @GetMapping("/ids")
    public ResponseEntity<List<Integer>> getAllCountryIds() {
        return ResponseEntity.ok(countryService.getAllCountryIds());
    }

    /**
     * GET /api/countries/{id}/profession/{professionId}
     * Data on demand and salary for a specific profession in a specific country.
     * Used by the recommendation-service to calculate personal rating.
     */
    @GetMapping("/{id}/profession/{professionId}")
    public ResponseEntity<CountryProfessionDto> getCountryProfession(
            @PathVariable Integer id,
            @PathVariable Integer professionId) {
        CountryProfession cp = countryProfessionRepository
                .findByIdCountryIdAndIdProfessionId(id, professionId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No profession data for country=" + id + ", profession=" + professionId));
        return ResponseEntity.ok(CountryProfessionDto.from(cp));
    }
}