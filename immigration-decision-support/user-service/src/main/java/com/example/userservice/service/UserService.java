package com.example.userservice.service;

import com.example.userservice.dto.LanguageSkillDto;
import com.example.userservice.dto.UserProfileRequest;
import com.example.userservice.dto.UserProfileResponse;
import com.example.userservice.entity.*;
import com.example.userservice.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FinancialLevelRepository financialLevelRepository;
    private final ProfessionRepository professionRepository;
    private final LanguageRepository languageRepository;
    private final UserLanguageSkillRepository userLanguageSkillRepository;

    @Transactional
    public UserProfileResponse saveProfile(Integer userId, UserProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        FinancialLevel fl = financialLevelRepository.findById(request.getFinancialLevelId())
                .orElseThrow(() -> new IllegalArgumentException("Financial level not found"));
        Profession prof = professionRepository.findById(request.getProfessionId())
                .orElseThrow(() -> new IllegalArgumentException("Profession not found"));

        user.setFinancialLevel(fl);
        user.setProfession(prof);
        user.setWorkExperience(request.getWorkExperience());
        user.setFamilyMembers(request.getFamilyMembers());
        user.setPreferredClimate(request.getPreferredClimate());
        user.setPreferredOceanSea(request.getPreferredOceanSea());
        user.setPreferredRegion(request.getPreferredRegion());
        user.setMigrationGoal(request.getMigrationGoal());
        user.setStateOfHealth(request.getStateOfHealth());

        // Replace language skills
        userLanguageSkillRepository.deleteByIdUserId(userId);
        userLanguageSkillRepository.flush();

        user.getLanguageSkills().clear();

        if (request.getLanguageSkills() != null) {
            for (LanguageSkillDto dto : request.getLanguageSkills()) {
                Language lang = languageRepository.findById(dto.getLanguageId())
                        .orElseThrow(() -> new IllegalArgumentException("Language not found: " + dto.getLanguageId()));
                UserLanguageSkill skill = new UserLanguageSkill();
                skill.setId(new UserLanguageSkillId(userId, dto.getLanguageId()));
                skill.setUser(user);
                skill.setLanguage(lang);
                skill.setLevel(dto.getLevel());
                user.getLanguageSkills().add(skill);
            }
        }

        userRepository.save(user);
        return toProfileResponse(user);
    }

    public UserProfileResponse getProfile(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toProfileResponse(user);
    }

    public UserProfileResponse getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toProfileResponse(user);
    }

    private UserProfileResponse toProfileResponse(User user) {
        UserProfileResponse resp = new UserProfileResponse();
        resp.setId(user.getId());
        resp.setEmail(user.getEmail());
        if (user.getFinancialLevel() != null) {
            resp.setFinancialLevelId(user.getFinancialLevel().getId());
            resp.setFinancialLevelAmount(user.getFinancialLevel().getAmount());
        }
        if (user.getProfession() != null) {
            resp.setProfessionId(user.getProfession().getId());
            resp.setProfessionName(user.getProfession().getName());
        }
        resp.setWorkExperience(user.getWorkExperience());
        resp.setFamilyMembers(user.getFamilyMembers());
        resp.setPreferredClimate(user.getPreferredClimate());
        resp.setPreferredOceanSea(user.getPreferredOceanSea());
        resp.setPreferredRegion(user.getPreferredRegion());
        resp.setMigrationGoal(user.getMigrationGoal());
        resp.setStateOfHealth(user.getStateOfHealth());

        List<UserProfileResponse.LanguageSkillResponse> skills = new ArrayList<>();
        for (UserLanguageSkill s : user.getLanguageSkills()) {
            UserProfileResponse.LanguageSkillResponse sr = new UserProfileResponse.LanguageSkillResponse();
            sr.setLanguageId(s.getLanguage().getId());
            sr.setLanguageName(s.getLanguage().getName());
            sr.setLevel(s.getLevel().name());
            skills.add(sr);
        }
        resp.setLanguageSkills(skills);
        return resp;
    }
}