package com.example.countryservice.dto;

import com.example.countryservice.entity.CountryProfession;
import lombok.Data;

@Data
public class CountryProfessionDto {

    private Integer countryId;
    private Integer professionId;
    private Integer demandForProfession;
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