package com.example.userservice.dto;

import com.example.userservice.entity.User;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class UserProfileRequest {

    @NotNull
    private Integer financialLevelId;

    @NotNull
    private Integer professionId;

    @NotNull
    @Min(0)
    private Integer workExperience;

    @NotNull
    @Min(1)
    private Integer familyMembers;

    @NotNull
    private User.Climate preferredClimate;

    @NotNull
    private User.OceanSeaPreference preferredOceanSea;

    @NotNull
    private User.Region preferredRegion;

    @NotNull
    private User.MigrationGoal migrationGoal;

    @NotNull
    private User.HealthState stateOfHealth;

    private List<LanguageSkillDto> languageSkills;
}