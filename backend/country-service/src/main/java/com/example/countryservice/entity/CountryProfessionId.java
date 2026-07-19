package com.example.countryservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CountryProfessionId implements Serializable {

    @Column(name = "country_id")
    private Integer countryId;

    @Column(name = "profession_id")
    private Integer professionId;
}