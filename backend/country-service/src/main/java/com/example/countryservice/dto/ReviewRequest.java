package com.example.countryservice.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ReviewRequest {

    @NotNull
    @DecimalMin("1")
    @DecimalMax("10")
    private BigDecimal rating;

    private String comment;
}