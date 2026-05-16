package com.example.recommendationservice.service;

import com.example.recommendationservice.client.CountryClient;
import com.example.recommendationservice.client.UserClient;
import com.example.recommendationservice.dto.*;
import com.example.recommendationservice.entity.PersonalRecommendation;
import com.example.recommendationservice.repository.PersonalRecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final PersonalRecommendationRepository recommendationRepository;
    private final RecommendationCalculator calculator;
    private final UserClient userClient;
    private final CountryClient countryClient;

    // -------------------------------------------------------------------
    // Creates a new rating session: one record per country with a
    // calculated score. All records in one session share the same createdAt.
    // -------------------------------------------------------------------
    @Transactional
    public List<RecommendationDto> create_all_recommendations_for_user(Integer userId) {
        UserProfileDto user = userClient.getUserById(userId);

        if (user.getProfessionId() == null || user.getFinancialLevelAmount() == null) {
            throw new IllegalStateException("User profile is not complete. Please fill in the survey first.");
        }

        List<Integer> countryIds = countryClient.getAllCountryIds();

        // One timestamp for the whole session (truncated to seconds for grouping)
        LocalDateTime sessionTime = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);

        List<PersonalRecommendation> recommendations = new ArrayList<>();

        for (Integer countryId : countryIds) {
            CountryDto country = countryClient.getCountryById(countryId);

            // demand and payment are fetched inside the calculator
            BigDecimal score = calculator.calculate_personal_recommendation_score(user, country);

            PersonalRecommendation rec = new PersonalRecommendation();
            rec.setUserId(userId);
            rec.setCountryId(countryId);
            rec.setScore(score);
            rec.setCreatedAt(sessionTime);
            recommendations.add(rec);
        }

        List<PersonalRecommendation> saved = recommendationRepository.saveAll(recommendations);

        return saved.stream()
                .sorted(Comparator.comparing(PersonalRecommendation::getScore,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .map(r -> RecommendationDto.from(r, countryClient.getCountryById(r.getCountryId())))
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------------------
    // Returns list of all session timestamps for the user (newest first).
    // -------------------------------------------------------------------
    public List<LocalDateTime> getSessionDates(Integer userId) {
        return recommendationRepository.findByUserId(userId).stream()
                .map(PersonalRecommendation::getCreatedAt)
                .distinct()
                .sorted(Comparator.reverseOrder())
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------------------
    // Returns a specific session by timestamp, with optional sorting.
    // sortBy: score (default) | countryName
    // direction: desc (default) | asc
    // -------------------------------------------------------------------
    public RecommendationSessionDto getSession(Integer userId, LocalDateTime sessionTime, String sortBy, String direction) {
        List<PersonalRecommendation> recs =
                recommendationRepository.findByUserIdAndCreatedAt(userId, sessionTime);

        if (recs.isEmpty()) {
            throw new IllegalArgumentException("Session not found");
        }

        List<RecommendationDto> dtos = recs.stream()
                .map(r -> RecommendationDto.from(r, countryClient.getCountryById(r.getCountryId())))
                .collect(Collectors.toList());

        Comparator<RecommendationDto> comparator = buildComparator(sortBy);
        if ("asc".equalsIgnoreCase(direction)) {
            dtos.sort(comparator);
        } else {
            dtos.sort(comparator.reversed());
        }

        return new RecommendationSessionDto(sessionTime, dtos);
    }

    // -------------------------------------------------------------------
    // Returns the most recent session for the user.
    // -------------------------------------------------------------------
    public RecommendationSessionDto getLatestSession(Integer userId, String sortBy, String direction) {
        List<LocalDateTime> dates = getSessionDates(userId);
        if (dates.isEmpty()) {
            throw new IllegalArgumentException("No recommendations found for user " + userId);
        }
        return getSession(userId, dates.get(0), sortBy, direction);
    }

    private Comparator<RecommendationDto> buildComparator(String sortBy) {
        return switch (sortBy == null ? "score" : sortBy) {
            case "countryName" -> Comparator.comparing(RecommendationDto::getCountryName,
                    Comparator.nullsLast(Comparator.naturalOrder()));
            default            -> Comparator.comparing(RecommendationDto::getScore,
                    Comparator.nullsLast(Comparator.naturalOrder()));
        };
    }
}