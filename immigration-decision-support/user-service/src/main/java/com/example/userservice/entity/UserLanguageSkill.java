package com.example.userservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "user_language_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLanguageSkill {

    @EmbeddedId
    private UserLanguageSkillId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @MapsId("languageId")
    @JoinColumn(name = "language_id")
    private Language language;

    @Enumerated(EnumType.STRING)
    @Column(name = "level", nullable = false)
    private LanguageLevel level;

    public enum LanguageLevel {
        A1, A2, B1, B2, C1, C2
    }
}