package com.example.userservice.repository;

import com.example.userservice.entity.UserLanguageSkill;
import com.example.userservice.entity.UserLanguageSkillId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserLanguageSkillRepository extends JpaRepository<UserLanguageSkill, UserLanguageSkillId> {
    List<UserLanguageSkill> findByIdUserId(Integer userId);
    @Transactional
    @Modifying
    void deleteByIdUserId(Integer userId);
}