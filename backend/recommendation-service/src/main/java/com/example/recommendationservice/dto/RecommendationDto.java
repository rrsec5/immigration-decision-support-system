package com.example.recommendationservice.dto;

import com.example.recommendationservice.entity.PersonalRecommendation;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class RecommendationDto {

    private Integer recommendationId;
    private Integer userId;
    private Integer countryId;
    private String countryName;
    private String shortCountryName;
    private String region;
    private BigDecimal score;
    private LocalDateTime createdAt;

    public static RecommendationDto from(PersonalRecommendation r, CountryDto country) {
        RecommendationDto dto = new RecommendationDto();
        dto.setRecommendationId(r.getRecommendationId());
        dto.setUserId(r.getUserId());
        dto.setCountryId(r.getCountryId());
        dto.setScore(r.getScore());
        dto.setCreatedAt(r.getCreatedAt());
        if (country != null) {
            dto.setCountryName(country.getName());
            dto.setShortCountryName(country.getShortName());
            dto.setRegion(country.getRegion());
        }
        return dto;
    }
}