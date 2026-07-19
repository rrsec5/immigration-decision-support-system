package com.example.userservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "financial_level_id")
    private FinancialLevel financialLevel;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "profession_id")
    private Profession profession;

    @Column(name = "work_experience")
    private Integer workExperience;

    @Column(name = "family_members")
    private Integer familyMembers;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_climate")
    private Climate preferredClimate;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_ocean_sea")
    private OceanSeaPreference preferredOceanSea;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_region")
    private Region preferredRegion;

    @Enumerated(EnumType.STRING)
    @Column(name = "migration_goal")
    private MigrationGoal migrationGoal;

    @Enumerated(EnumType.STRING)
    @Column(name = "state_of_health")
    private HealthState stateOfHealth;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<UserLanguageSkill> languageSkills = new ArrayList<>();

    public enum Climate { cold, moderate, warm, any }
    public enum OceanSeaPreference { yes, no, any }
    public enum Region { Europe, Asia, North_America, South_America, Australia, any }
    public enum MigrationGoal { work, study, living }
    public enum HealthState { healthy, minor_issues, serious_conditions }
}