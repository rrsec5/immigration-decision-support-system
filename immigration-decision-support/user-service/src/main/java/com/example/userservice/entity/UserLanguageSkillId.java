package com.example.userservice.entity;

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
public class UserLanguageSkillId implements Serializable {

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "language_id")
    private Integer languageId;
}