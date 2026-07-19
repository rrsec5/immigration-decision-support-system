package com.example.recommendationservice.repository;

import com.example.recommendationservice.entity.PersonalRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PersonalRecommendationRepository extends JpaRepository<PersonalRecommendation, Integer> {

    // All user records - to get all sessions (dates)
    List<PersonalRecommendation> findByUserId(Integer userId);

    // All user posts for a specific creation date (one "rating")
    List<PersonalRecommendation> findByUserIdAndCreatedAt(Integer userId, LocalDateTime createdAt);

    // All unique dates of user rating creation
    // (implemented in the service via distinct on the stream)
}