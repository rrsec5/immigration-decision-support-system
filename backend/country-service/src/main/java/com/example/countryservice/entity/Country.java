package com.example.countryservice.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "country")
@Data
public class Country {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "shortname", nullable = false)
    private String shortName;

    @Column(name = "overall_rating")
    private BigDecimal overallRating;

    @Column(name = "user_rating")
    private BigDecimal userRating;

    @Enumerated(EnumType.STRING)
    @Column(name = "region", nullable = false)
    private Region region;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "primary_language_id", nullable = false)
    private Language primaryLanguage;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "secondary_language_id")
    private Language secondaryLanguage;

    @Column(name = "cost_of_living", nullable = false)
    private Integer costOfLiving;

    @Column(name = "economy_index", nullable = false)
    private BigDecimal economyIndex;

    @Column(name = "quality_of_life", nullable = false)
    private BigDecimal qualityOfLife;

    @Enumerated(EnumType.STRING)
    @Column(name = "climate", nullable = false)
    private Climate climate;

    @Column(name = "is_near_ocean_sea", nullable = false)
    private Boolean isNearOceanSea;

    @Column(name = "safety_level", nullable = false)
    private BigDecimal safetyLevel;

    @Column(name = "education_level", nullable = false)
    private BigDecimal educationLevel;

    @Column(name = "healthcare_level", nullable = false)
    private BigDecimal healthcareLevel;

    @Column(name = "employment_opportunities", nullable = false)
    private BigDecimal employmentOpportunities;

    @Column(name = "immigration_policy", nullable = false)
    private BigDecimal immigrationPolicy;

    @Column(name = "social_institutions", nullable = false)
    private BigDecimal socialInstitutions;

    public enum Region {
        Europe, Asia, North_America, South_America, Australia
    }

    public enum Climate { cold, moderate, warm }
}