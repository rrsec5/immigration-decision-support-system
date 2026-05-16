package com.example.countryservice.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "country_profession")
@Data
public class CountryProfession {

    @EmbeddedId
    private CountryProfessionId id;

    @Column(name = "demand_for_profession", nullable = false)
    private Integer demandForProfession;

    @Column(name = "payment_for_profession", nullable = false)
    private Integer paymentForProfession;
}