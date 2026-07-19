package com.example.recommendationservice.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserProfileDto {
    private Integer id;
    private String email;
    private Integer financialLevelId;
    private Integer financialLevelAmount;
    private Integer professionId;
    private String professionName;
    private Integer workExperience;
    private Integer familyMembers;
    private String preferredClimate;
    private String preferredOceanSea;
    private String preferredRegion;
    private String migrationGoal;
    private String stateOfHealth;
    private List<LanguageSkillDto> languageSkills;

    @Data
    public static class LanguageSkillDto {
        private Integer languageId;
        private String languageName;
        private String level;
    }
}