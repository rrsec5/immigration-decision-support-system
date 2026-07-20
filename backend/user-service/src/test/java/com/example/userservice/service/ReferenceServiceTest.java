package com.example.userservice.service;

import com.example.userservice.entity.FinancialLevel;
import com.example.userservice.entity.Language;
import com.example.userservice.entity.Profession;
import com.example.userservice.repository.FinancialLevelRepository;
import com.example.userservice.repository.LanguageRepository;
import com.example.userservice.repository.ProfessionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReferenceServiceTest {
    @Mock
    private LanguageRepository languageRepository;

    @Mock
    private ProfessionRepository professionRepository;

    @Mock
    private FinancialLevelRepository financialLevelRepository;


    @InjectMocks
    private ReferenceService referenceService;

    @Test
    void getAllReferences_shouldReturnDataFromRepositories() {


        when(languageRepository.findAll())
                .thenReturn(List.of(new Language()));

        when(professionRepository.findAll())
                .thenReturn(List.of(new Profession()));

        when(financialLevelRepository.findAll())
                .thenReturn(List.of(new FinancialLevel()));

        assertEquals(
                1,
                referenceService.getAllLanguages().size()
        );

        assertEquals(
                1,
                referenceService.getAllProfessions().size()
        );

        assertEquals(
                1,
                referenceService.getAllFinancialLevels().size()
        );

        verify(languageRepository)
                .findAll();

        verify(professionRepository)
                .findAll();

        verify(financialLevelRepository)
                .findAll();
    }

}
