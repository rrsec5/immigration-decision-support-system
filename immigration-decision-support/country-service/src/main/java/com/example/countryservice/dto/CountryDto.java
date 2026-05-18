package com.example.countryservice.dto;

import com.example.countryservice.entity.Country;
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

    public static CountryDto from(Country c) {
        CountryDto dto = new CountryDto();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setShortName(c.getShortName());
        dto.setRegion(c.getRegion() != null ? c.getRegion().name().replace("_", " ") : null);
        dto.setOverallRating(c.getOverallRating());
        dto.setUserRating(c.getUserRating());
        dto.setCostOfLiving(c.getCostOfLiving());
        dto.setEconomyIndex(c.getEconomyIndex());
        dto.setQualityOfLife(c.getQualityOfLife());
        dto.setClimate(c.getClimate() != null ? c.getClimate().name() : null);
        dto.setIsNearOceanSea(c.getIsNearOceanSea());
        dto.setSafetyLevel(c.getSafetyLevel());
        dto.setEducationLevel(c.getEducationLevel());
        dto.setHealthcareLevel(c.getHealthcareLevel());
        dto.setEmploymentOpportunities(c.getEmploymentOpportunities());
        dto.setImmigrationPolicy(c.getImmigrationPolicy());
        dto.setSocialInstitutions(c.getSocialInstitutions());
        if (c.getPrimaryLanguage() != null) {
            dto.setPrimaryLanguageId(c.getPrimaryLanguage().getId());
            dto.setPrimaryLanguageName(c.getPrimaryLanguage().getName());
        }
        if (c.getSecondaryLanguage() != null) {
            dto.setSecondaryLanguageId(c.getSecondaryLanguage().getId());
            dto.setSecondaryLanguageName(c.getSecondaryLanguage().getName());
        }
        return dto;
    }
}