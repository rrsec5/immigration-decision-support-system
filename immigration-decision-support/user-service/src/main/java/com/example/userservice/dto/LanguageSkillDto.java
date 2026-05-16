package com.example.userservice.dto;

import com.example.userservice.entity.UserLanguageSkill;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LanguageSkillDto {

    @NotNull
    private Integer languageId;

    @NotNull
    private UserLanguageSkill.LanguageLevel level;
}

