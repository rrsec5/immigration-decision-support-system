package com.example.countryservice.dto;

import com.example.countryservice.entity.Review;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ReviewDto {

    private Integer userId;
    private Integer countryId;
    private BigDecimal rating;
    private String comment;
    private LocalDateTime createdAt;

    public static ReviewDto from(Review r) {
        ReviewDto dto = new ReviewDto();
        dto.setUserId(r.getId().getUserId());
        dto.setCountryId(r.getId().getCountryId());
        dto.setRating(r.getRating());
        dto.setComment(r.getComment());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}