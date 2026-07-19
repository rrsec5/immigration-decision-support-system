package com.example.countryservice.repository;

import com.example.countryservice.entity.CountryProfession;
import com.example.countryservice.entity.CountryProfessionId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CountryProfessionRepository extends JpaRepository<CountryProfession, CountryProfessionId> {

    Optional<CountryProfession> findByIdCountryIdAndIdProfessionId(Integer countryId, Integer professionId);
}