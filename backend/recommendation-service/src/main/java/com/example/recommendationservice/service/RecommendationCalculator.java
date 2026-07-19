package com.example.recommendationservice.service;

import com.example.recommendationservice.client.CountryClient;
import com.example.recommendationservice.dto.CountryDto;
import com.example.recommendationservice.dto.CountryProfessionDto;
import com.example.recommendationservice.dto.UserProfileDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * All functions from triggers_procedures.sql implemented as Java methods.
 * Method names are preserved exactly as in SQL.
 */
@Component
@RequiredArgsConstructor
public class RecommendationCalculator {

    private final CountryClient countryClient;

    // -------------------------------------------------------------------
    // calculate_language_score(p_user_id, p_country_id)
    // primary:   5 + (A1->1, A2->2, B1->3, B2->4, C1/C2->5)
    // secondary: 2 + (A1->1, A2->2, B1->3, B2->4, C1/C2->5)
    // Returns the best result, or 0 if the user knows no language of the country.
    // -------------------------------------------------------------------
    public int calculate_language_score(UserProfileDto user, CountryDto country) {
        int primaryScore = 0;
        int secondaryScore = 0;

        if (country.getPrimaryLanguageId() != null) {
            String level = findLanguageLevel(user.getLanguageSkills(), country.getPrimaryLanguageId());
            if (level != null) {
                primaryScore = 5 + levelToPoints(level);
            }
        }

        if (country.getSecondaryLanguageId() != null) {
            String level = findLanguageLevel(user.getLanguageSkills(), country.getSecondaryLanguageId());
            if (level != null) {
                secondaryScore = 2 + levelToPoints(level);
            }
        }

        return Math.max(primaryScore, secondaryScore);
    }

    private String findLanguageLevel(List<UserProfileDto.LanguageSkillDto> skills, Integer languageId) {
        if (skills == null) return null;
        return skills.stream()
                .filter(s -> s.getLanguageId().equals(languageId))
                .map(UserProfileDto.LanguageSkillDto::getLevel)
                .findFirst()
                .orElse(null);
    }

    private int levelToPoints(String level) {
        return switch (level) {
            case "A1" -> 1;
            case "A2" -> 2;
            case "B1" -> 3;
            case "B2" -> 4;
            case "C1", "C2" -> 5;
            default -> 0;
        };
    }

    // -------------------------------------------------------------------
    // calculate_profession_score(p_user_id, p_country_id)
    // min(((opportunities * 0.6 + (experience / 3) * 0.4) * (1 + demand * 0.5)),10)
    // -------------------------------------------------------------------
    public BigDecimal calculate_profession_score(BigDecimal demand, int experience, BigDecimal employmentOpportunities) {
        int cappedExperience = Math.min(experience, 30);

        BigDecimal experienceScore = BigDecimal.valueOf(cappedExperience)
                .divide(BigDecimal.valueOf(3), 4, RoundingMode.HALF_UP);

        BigDecimal baseScore =
                employmentOpportunities.multiply(BigDecimal.valueOf(0.6))
                        .add(experienceScore.multiply(BigDecimal.valueOf(0.4)));

        BigDecimal modifier =
                BigDecimal.ONE.add(demand.multiply(BigDecimal.valueOf(0.5)));

        BigDecimal finalScore = baseScore.multiply(modifier);

        if (finalScore.compareTo(BigDecimal.TEN) > 0) {
            finalScore = BigDecimal.TEN;
        }

        return finalScore.setScale(1, RoundingMode.HALF_UP);

    }

    // -----------------------------------------------------------------------
    // calculate_salary_score(p_user_id, p_country_id)
    // base = (profScore / 10) * (payment / (cost * family))
    // result = min(base, 2) * 5
    // -----------------------------------------------------------------------
    public BigDecimal calculate_salary_score(BigDecimal professionScore, int payment, int costOfLiving, int familyMembers) {
        if (costOfLiving == 0 || familyMembers == 0) return BigDecimal.ZERO;

        BigDecimal base = professionScore
                .divide(BigDecimal.valueOf(10), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(payment))
                .divide(BigDecimal.valueOf((long) costOfLiving * familyMembers), 4, RoundingMode.HALF_UP);

        BigDecimal capped = base.min(BigDecimal.valueOf(2));
        return capped.multiply(BigDecimal.valueOf(5)).setScale(1, RoundingMode.HALF_UP);
    }

    // -----------------------------------------------------------------------
    // calculate_financial_cushion_score(p_user_id, p_country_id)
    // months = amount / (cost * family)
    // result = min(months, 5) * 2
    // -----------------------------------------------------------------------
    public BigDecimal calculate_financial_cushion_score(int financialAmount, int costOfLiving, int familyMembers) {
        if (costOfLiving == 0 || familyMembers == 0) return BigDecimal.ZERO;

        BigDecimal months = BigDecimal.valueOf(financialAmount)
                .divide(BigDecimal.valueOf((long) costOfLiving * familyMembers), 4, RoundingMode.HALF_UP);

        BigDecimal capped = months.min(BigDecimal.valueOf(5));
        return capped.multiply(BigDecimal.valueOf(2)).setScale(1, RoundingMode.HALF_UP);
    }

    // -------------------------------------------------------------------
    // calculate_climate_score(p_user_id, p_country_id)
    // any/match -> 10 | adjacent -> 5 | opposite -> 0
    // -------------------------------------------------------------------
    public int calculate_climate_score(String userClimate, String countryClimate) {
        if ("any".equals(userClimate)) return 10;
        if (userClimate.equals(countryClimate)) return 10;
        if (("cold".equals(userClimate) && "moderate".equals(countryClimate))
                || ("moderate".equals(userClimate) && ("cold".equals(countryClimate) || "warm".equals(countryClimate)))
                || ("warm".equals(userClimate) && "moderate".equals(countryClimate))) {
            return 5;
        }
        return 0;
    }

    // -------------------------------------------------------------------
    // calculate_climate_weight(p_user_id)
    // any -> 0, else 2
    // -------------------------------------------------------------------
    public int calculate_climate_weight(String userClimate) {
        return "any".equals(userClimate) ? 0 : 2;
    }

    // -----------------------------------------------------------------------
    // calculate_sea_score(p_user_id, p_country_id)
    // -----------------------------------------------------------------------
    public int calculate_sea_score(String userPref, boolean isNearSea) {
        if ("any".equals(userPref)) return 10;
        if ("yes".equals(userPref)) return isNearSea ? 10 : 0;
        if ("no".equals(userPref))  return isNearSea ? 0  : 10;
        return 0;
    }

    // -------------------------------------------------------------------
    // calculate_sea_weight(p_user_id)
    // any -> 0, else 1
    // -------------------------------------------------------------------
    public int calculate_sea_weight(String userPref) {
        return "any".equals(userPref) ? 0 : 1;
    }

    // -----------------------------------------------------------------------
    // calculate_region_score(p_user_id, p_country_id)
    // -----------------------------------------------------------------------
    public int calculate_region_score(String userRegion, String countryRegion) {
        if (userRegion == null || countryRegion == null) {
            return 0;
        }
        if ("any".equals(userRegion)) return 10;
        // normalizing: "North America" → "North_America"
        String normUser    = userRegion.replace(" ", "_");
        String normCountry = countryRegion.replace(" ", "_");
        return normUser.equals(normCountry) ? 10 : 0;
    }

    // -------------------------------------------------------------------
    // calculate_region_weight(p_user_id)
    // any -> 0, else 1
    // -------------------------------------------------------------------
    public int calculate_region_weight(String userRegion) {
        if (userRegion == null) {
            return 0;
        }
        return "any".equals(userRegion) ? 0 : 1;
    }

    // -------------------------------------------------------------------
    // calculate_salary_weight_by_goal(p_user_id)
    // work -> 6, else 4
    // -------------------------------------------------------------------
    public int calculate_salary_weight_by_goal(String migrationGoal) {
        return "work".equals(migrationGoal) ? 6 : 4;
    }

    // -------------------------------------------------------------------
    // calculate_education_weight_by_goal(p_user_id)
    // study -> 4, else 1
    // -------------------------------------------------------------------
    public int calculate_education_weight_by_goal(String migrationGoal) {
        return "study".equals(migrationGoal) ? 4 : 1;
    }

    // -------------------------------------------------------------------
    // calculate_quality_of_life_weight_by_goal(p_user_id)
    // living -> 5, else 3
    // -------------------------------------------------------------------
    public int calculate_quality_of_life_weight_by_goal(String migrationGoal) {
        return "living".equals(migrationGoal) ? 5 : 3;
    }

    // -----------------------------------------------------------------------
    // calculate_healthcare_weight_by_health(p_user_id)
    // healthy → 1, minor_issues → 2, serious_conditions → 3
    // -----------------------------------------------------------------------
    public int calculate_healthcare_weight_by_health(String stateOfHealth) {
        return switch (stateOfHealth) {
            case "minor_issues"       -> 2;
            case "serious_conditions" -> 3;
            default                   -> 1;
        };
    }

    // -------------------------------------------------------------------
    // calculate_personal_recommendation_score(p_user_id, p_country_id)
    // demand and payment are fetched internally via CountryClient
    // so the caller only needs to pass user and country.
    // -------------------------------------------------------------------
    public BigDecimal calculate_personal_recommendation_score(UserProfileDto user, CountryDto country) {

        // Fetch demand and payment internally
        BigDecimal demand = BigDecimal.ZERO;
        int payment = 0;
        if (user.getProfessionId() != null) {
            try {
                CountryProfessionDto cp = countryClient.getCountryProfession(
                        country.getId(), user.getProfessionId());
                demand  = cp.getDemandForProfession()  != null ? cp.getDemandForProfession()  : BigDecimal.ZERO;
                payment = cp.getPaymentForProfession() != null ? cp.getPaymentForProfession() : 0;
            } catch (Exception ignored) {
                // No profession data for this country — use 0
            }
        }

        // User profile fields
        String climate    = user.getPreferredClimate();
        String seaPref    = user.getPreferredOceanSea();
        String region     = user.getPreferredRegion();
        String goal       = user.getMigrationGoal();
        String health     = user.getStateOfHealth();
        int    experience = user.getWorkExperience()       != null ? user.getWorkExperience()       : 0;
        int    family     = user.getFamilyMembers()        != null ? user.getFamilyMembers()        : 1;
        int    finAmount  = user.getFinancialLevelAmount() != null ? user.getFinancialLevelAmount() : 0;

        // Component scores
        int        langScore    = calculate_language_score(user, country);
        BigDecimal profScore    = calculate_profession_score(demand, experience, country.getEmploymentOpportunities());
        BigDecimal salaryScore  = calculate_salary_score(profScore, payment, country.getCostOfLiving(), family);
        BigDecimal cushionScore = calculate_financial_cushion_score(finAmount, country.getCostOfLiving(), family);
        int climateScore  = calculate_climate_score(climate, country.getClimate());
        int climateWeight = calculate_climate_weight(climate);
        int seaScore      = calculate_sea_score(seaPref, Boolean.TRUE.equals(country.getIsNearOceanSea()));
        int seaWeight     = calculate_sea_weight(seaPref);
        int regionScore   = calculate_region_score(region, country.getRegion());
        int regionWeight  = calculate_region_weight(region);

        int salaryWeight  = calculate_salary_weight_by_goal(goal);
        int eduWeight     = calculate_education_weight_by_goal(goal);
        int qualWeight    = calculate_quality_of_life_weight_by_goal(goal);
        int healthWeight  = calculate_healthcare_weight_by_health(health);

        BigDecimal ur = country.getUserRating();
        boolean hasUserRating = ur != null && ur.compareTo(BigDecimal.ZERO) != 0;

        // Numerator
        BigDecimal numerator = BigDecimal.valueOf(langScore * 3L)
                .add(salaryScore.multiply(BigDecimal.valueOf(salaryWeight)))
                .add(cushionScore.multiply(BigDecimal.valueOf(3)))
                .add(BigDecimal.valueOf((long) climateScore * climateWeight))
                .add(BigDecimal.valueOf((long) seaScore     * seaWeight))
                .add(BigDecimal.valueOf((long) regionScore  * regionWeight))
                .add(hasUserRating ? ur : BigDecimal.ZERO)
                .add(country.getEconomyIndex().multiply(BigDecimal.valueOf(3)))
                .add(country.getQualityOfLife().multiply(BigDecimal.valueOf(qualWeight)))
                .add(country.getSafetyLevel().multiply(BigDecimal.valueOf(2)))
                .add(country.getEducationLevel().multiply(BigDecimal.valueOf(eduWeight)))
                .add(country.getHealthcareLevel().multiply(BigDecimal.valueOf(healthWeight)))
                .add(country.getEmploymentOpportunities())
                .add(country.getImmigrationPolicy())
                .add(country.getSocialInstitutions());

        // Denominator
        long denominator = 3L + salaryWeight + 3L
                + climateWeight + seaWeight + regionWeight
                + (hasUserRating ? 1 : 0)
                + 3L + qualWeight + 2L + eduWeight + healthWeight
                + 1L + 1L + 1L;

        return numerator.divide(BigDecimal.valueOf(denominator), 4, RoundingMode.HALF_UP)
                .setScale(2, RoundingMode.HALF_UP);
    }
}