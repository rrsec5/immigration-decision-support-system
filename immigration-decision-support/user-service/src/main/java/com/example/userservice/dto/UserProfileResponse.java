package com.example.userservice.dto;

import com.example.userservice.entity.User;
import lombok.Data;

import java.util.List;

@Data
public class UserProfileResponse {
    private Integer id;
    private String email;
    private Integer financialLevelId;
    private Integer financialLevelAmount;
    private Integer professionId;
    private String professionName;
    private Integer workExperience;
    private Integer familyMembers;
    private User.Climate preferredClimate;
    private User.OceanSeaPreference preferredOceanSea;
    private User.Region preferredRegion;
    private User.MigrationGoal migrationGoal;
    private User.HealthState stateOfHealth;
    private List<LanguageSkillResponse> languageSkills;

    @Data
    public static class LanguageSkillResponse {
        private Integer languageId;
        private String languageName;
        private String level;
    }
}