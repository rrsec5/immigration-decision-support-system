package com.example.recommendationservice.service;

import com.example.recommendationservice.client.CountryClient;
import com.example.recommendationservice.dto.CountryDto;
import com.example.recommendationservice.dto.CountryProfessionDto;
import com.example.recommendationservice.dto.UserProfileDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RecommendationCalculatorTest {

    @Mock
    private CountryClient countryClient;

    @InjectMocks
    private RecommendationCalculator calculator;

    @Test
    void calculateLanguageScore_primaryLanguageB2_returns9() {

        UserProfileDto user = new UserProfileDto();

        UserProfileDto.LanguageSkillDto skill =
                new UserProfileDto.LanguageSkillDto();

        skill.setLanguageId(1);
        skill.setLevel("B2");

        user.setLanguageSkills(List.of(skill));

        CountryDto country = new CountryDto();

        country.setPrimaryLanguageId(1);

        int result = calculator.calculate_language_score(user, country);

        assertEquals(9, result);
    }

    @Test
    void calculateProfessionScore_returnsCorrectValue() {

        BigDecimal result =
                calculator.calculate_profession_score(
                        BigDecimal.ONE,
                        6,
                        BigDecimal.valueOf(8)
                );

        assertEquals(
                new BigDecimal("8.4"),
                result
        );
    }

    @ParameterizedTest
    @CsvSource({
            "warm,warm,10",
            "cold,moderate,5",
            "cold,warm,0"
    })
    void calculateClimateScore_returnsExpected(
            String userClimate,
            String countryClimate,
            int expected
    ) {

        int result =
                calculator.calculate_climate_score(
                        userClimate,
                        countryClimate
                );

        assertEquals(expected, result);
    }

    @Test
    void calculateSeaScore_userWantsSea_countryHasSea_returns10() {

        int result =
                calculator.calculate_sea_score(
                        "yes",
                        true
                );

        assertEquals(10, result);
    }

    @Test
    void calculatePersonalRecommendationScoreTest() {

        UserProfileDto user = new UserProfileDto();

        user.setProfessionId(1);
        user.setFinancialLevelAmount(50000);
        user.setWorkExperience(5);
        user.setFamilyMembers(2);

        user.setPreferredClimate("warm");
        user.setPreferredOceanSea("yes");
        user.setPreferredRegion("Europe");

        user.setMigrationGoal("work");
        user.setStateOfHealth("healthy");

        CountryDto country = new CountryDto();

        country.setId(1);
        country.setName("Portugal");

        country.setRegion("Europe");
        country.setClimate("warm");
        country.setIsNearOceanSea(true);

        country.setCostOfLiving(1000);

        country.setEconomyIndex(BigDecimal.valueOf(8));
        country.setQualityOfLife(BigDecimal.valueOf(8));
        country.setSafetyLevel(BigDecimal.valueOf(8));
        country.setEducationLevel(BigDecimal.valueOf(8));
        country.setHealthcareLevel(BigDecimal.valueOf(8));

        country.setEmploymentOpportunities(BigDecimal.valueOf(7));
        country.setImmigrationPolicy(BigDecimal.valueOf(7));
        country.setSocialInstitutions(BigDecimal.valueOf(7));

        country.setPrimaryLanguageId(1);

        country.setUserRating(BigDecimal.valueOf(8));

        CountryProfessionDto profession = new CountryProfessionDto();

        profession.setDemandForProfession(
                BigDecimal.valueOf(0.8)
        );

        profession.setPaymentForProfession(3000);

        when(countryClient.getCountryProfession(1,1))
                .thenReturn(profession);

        BigDecimal result =
                calculator.calculate_personal_recommendation_score(
                        user,
                        country
                );

        assertNotNull(result);

        assertTrue(
                result.compareTo(BigDecimal.ZERO) > 0
        );

        assertTrue(
                result.compareTo(BigDecimal.TEN) < 0
        );
    }
}
