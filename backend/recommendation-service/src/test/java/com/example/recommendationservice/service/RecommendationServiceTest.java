package com.example.recommendationservice.service;

import com.example.recommendationservice.client.CountryClient;
import com.example.recommendationservice.client.UserClient;
import com.example.recommendationservice.dto.CountryDto;
import com.example.recommendationservice.dto.RecommendationDto;
import com.example.recommendationservice.dto.RecommendationSessionDto;
import com.example.recommendationservice.dto.UserProfileDto;
import com.example.recommendationservice.entity.PersonalRecommendation;
import com.example.recommendationservice.repository.PersonalRecommendationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RecommendationServiceTest {

    @Mock
    private PersonalRecommendationRepository recommendationRepository;

    @Mock
    private RecommendationCalculator calculator;

    @Mock
    private UserClient userClient;

    @Mock
    private CountryClient countryClient;

    @InjectMocks
    private RecommendationService recommendationService;

    @Test
    void createAllRecommendationsForUserSuccessTest() {

        Integer userId = 1;

        UserProfileDto user = new UserProfileDto();

        user.setId(userId);
        user.setProfessionId(10);
        user.setFinancialLevelAmount(50000);

        when(userClient.getUserById(userId))
                .thenReturn(user);

        List<Integer> countryIds = List.of(1, 2);

        when(countryClient.getAllCountryIds())
                .thenReturn(countryIds);

        CountryDto portugal = new CountryDto();
        portugal.setId(1);
        portugal.setName("Portugal");

        CountryDto canada = new CountryDto();
        canada.setId(2);
        canada.setName("Canada");

        when(countryClient.getCountryById(1))
                .thenReturn(portugal);

        when(countryClient.getCountryById(2))
                .thenReturn(canada);

        when(calculator.calculate_personal_recommendation_score(
                eq(user),
                any(CountryDto.class)
        ))
                .thenReturn(BigDecimal.valueOf(8));


        when(recommendationRepository.saveAll(anyList()))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        List<RecommendationDto> result =
                recommendationService
                        .create_all_recommendations_for_user(userId);

        assertNotNull(result);

        assertEquals(2, result.size());

        verify(userClient)
                .getUserById(userId);

        verify(countryClient)
                .getAllCountryIds();

        verify(recommendationRepository)
                .saveAll(anyList());

        verify(calculator, times(2))
                .calculate_personal_recommendation_score(
                        eq(user),
                        any(CountryDto.class)
                );
    }

    @Test
    void createAllRecommendationsForUserProfileIncompleteTest() {

        Integer userId = 1;

        UserProfileDto user = new UserProfileDto();

        user.setId(userId);

        user.setProfessionId(null);
        user.setFinancialLevelAmount(null);

        when(userClient.getUserById(userId))
                .thenReturn(user);

        assertThrows(
                IllegalStateException.class,
                () -> recommendationService
                        .create_all_recommendations_for_user(userId)
        );

        verify(userClient)
                .getUserById(userId);

        verifyNoInteractions(countryClient);
        verifyNoInteractions(recommendationRepository);
        verifyNoInteractions(calculator);
    }

    @Test
    void getSessionTest() {

        Integer userId = 1;

        LocalDateTime sessionTime =
                LocalDateTime.of(2026, 7, 20, 12, 0);

        PersonalRecommendation first =
                new PersonalRecommendation();

        first.setUserId(userId);
        first.setCountryId(1);
        first.setScore(BigDecimal.valueOf(7));
        first.setCreatedAt(sessionTime);

        PersonalRecommendation second =
                new PersonalRecommendation();

        second.setUserId(userId);
        second.setCountryId(2);
        second.setScore(BigDecimal.valueOf(9));
        second.setCreatedAt(sessionTime);

        when(recommendationRepository
                .findByUserIdAndCreatedAt(userId, sessionTime))
                .thenReturn(List.of(first, second));

        CountryDto canada = new CountryDto();

        canada.setId(1);
        canada.setName("Canada");

        CountryDto portugal = new CountryDto();

        portugal.setId(2);
        portugal.setName("Portugal");

        when(countryClient.getCountryById(1))
                .thenReturn(canada);


        when(countryClient.getCountryById(2))
                .thenReturn(portugal);

        RecommendationSessionDto result =
                recommendationService.getSession(
                        userId,
                        sessionTime,
                        "score",
                        "desc"
                );

        assertNotNull(result);

        assertEquals(
                sessionTime,
                result.getCreatedAt()
        );


        assertEquals(
                2,
                result.getRankings().size()
        );

        assertEquals(
                "Portugal",
                result.getRankings()
                        .get(0)
                        .getCountryName()
        );

        verify(recommendationRepository)
                .findByUserIdAndCreatedAt(
                        userId,
                        sessionTime
                );

        verify(countryClient, times(2))
                .getCountryById(anyInt());
    }
}
