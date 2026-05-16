package com.example.recommendationservice.dto;

import lombok.Data;

@Data
public class CountryProfessionDto {
    private Integer countryId;
    private Integer professionId;
    private Integer demandForProfession;
    private Integer paymentForProfession;
}