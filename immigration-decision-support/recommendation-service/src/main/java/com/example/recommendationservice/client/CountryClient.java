package com.example.recommendationservice.client;

import com.example.recommendationservice.config.FeignClientConfig;
import com.example.recommendationservice.dto.CountryDto;
import com.example.recommendationservice.dto.CountryProfessionDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "country-service", configuration = FeignClientConfig.class)
public interface CountryClient {

    @GetMapping("/api/countries/{id}")
    CountryDto getCountryById(@PathVariable("id") Integer id);

    @GetMapping("/api/countries/ids")
    List<Integer> getAllCountryIds();

    @GetMapping("/api/countries/{id}/profession/{professionId}")
    CountryProfessionDto getCountryProfession(
            @PathVariable("id") Integer countryId,
            @PathVariable("professionId") Integer professionId);
}