package com.example.recommendationservice.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CountryDto {
    private Integer id;
    private String name;
    private String shortName;
    private String region;
    private BigDecimal overallRating;
    private BigDecimal userRating;
    private Integer costOfLiving;
    private BigDecimal economyIndex;
    private BigDecimal qualityOfLife;
    private String climate;
    private Boolean isNearOceanSea;
    private BigDecimal safetyLevel;
    private BigDecimal educationLevel;
    private BigDecimal healthcareLevel;
    private BigDecimal employmentOpportunities;
    private BigDecimal immigrationPolicy;
    private BigDecimal socialInstitutions;
    private Integer primaryLanguageId;
    private String primaryLanguageName;
    private Integer secondaryLanguageId;
    private String secondaryLanguageName;
}