package com.example.recommendationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class RecommendationSessionDto {
    private LocalDateTime createdAt;
    private List<RecommendationDto> rankings;
}