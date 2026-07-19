package com.example.countryservice.dto;

import com.example.countryservice.entity.CountryProfession;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CountryProfessionDto {

    private Integer countryId;
    private Integer professionId;
    private BigDecimal demandForProfession;
    private Integer paymentForProfession;

    public static CountryProfessionDto from(CountryProfession cp) {
        CountryProfessionDto dto = new CountryProfessionDto();
        dto.setCountryId(cp.getId().getCountryId());
        dto.setProfessionId(cp.getId().getProfessionId());
        dto.setDemandForProfession(cp.getDemandForProfession());
        dto.setPaymentForProfession(cp.getPaymentForProfession());
        return dto;
    }
}