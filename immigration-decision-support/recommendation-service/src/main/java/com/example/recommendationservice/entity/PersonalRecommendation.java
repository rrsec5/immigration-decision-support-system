package com.example.recommendationservice.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "personal_recommendation")
@Data
public class PersonalRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recommendation_id")
    private Integer recommendationId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "country_id", nullable = false)
    private Integer countryId;

    @Column(name = "score")
    private BigDecimal score;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

}