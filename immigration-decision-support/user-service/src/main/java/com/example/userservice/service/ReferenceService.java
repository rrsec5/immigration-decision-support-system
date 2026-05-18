package com.example.userservice.service;

import com.example.userservice.entity.FinancialLevel;
import com.example.userservice.entity.Language;
import com.example.userservice.entity.Profession;
import com.example.userservice.repository.FinancialLevelRepository;
import com.example.userservice.repository.LanguageRepository;
import com.example.userservice.repository.ProfessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReferenceService {

    private final LanguageRepository languageRepository;
    private final ProfessionRepository professionRepository;
    private final FinancialLevelRepository financialLevelRepository;

    public List<Language> getAllLanguages() {
        return languageRepository.findAll();
    }

    public List<Profession> getAllProfessions() {
        return professionRepository.findAll();
    }

    public List<FinancialLevel> getAllFinancialLevels() {
        return financialLevelRepository.findAll();
    }
}