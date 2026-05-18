package com.example.recommendationservice.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CountryProfessionDto {
    private Integer countryId;
    private Integer professionId;
    private BigDecimal demandForProfession;
    private Integer paymentForProfession;
}