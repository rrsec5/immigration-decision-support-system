package com.example.recommendationservice.controller;

import com.example.recommendationservice.dto.RecommendationDto;
import com.example.recommendationservice.dto.RecommendationSessionDto;
import com.example.recommendationservice.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    /**
     * POST /api/recommendations/generate
     * Creates a new personal rating session for the user.
     *
     * Header: X-User-Id — id of the authenticated user.
     *
     * Returns a list of countries with scores, sorted by score in descending order.
     */
    @PostMapping("/generate")
    public ResponseEntity<List<RecommendationDto>> generate(
            @RequestHeader("X-User-Id") Integer userId) {
        return ResponseEntity.ok(recommendationService.create_all_recommendations_for_user(userId));
    }

    /**
     * GET /api/recommendations/sessions
     * List of dates of all user sessions (from newest to oldest).
     * The frontend displays them as "Rating from 05/12/2026", "Rating from 04/01/2026", etc.
     */
    @GetMapping("/sessions")
    public ResponseEntity<List<LocalDateTime>> getSessions(
            @RequestHeader("X-User-Id") Integer userId) {
        return ResponseEntity.ok(recommendationService.getSessionDates(userId));
    }

    /**
     * GET /api/recommendations/sessions/latest
     * The last (most recent) user session.
     *
     * Parameters:
     *   sortBy    — score (by default) | countryName
     *   direction — desc (by default) | asc
     */
    @GetMapping("/sessions/latest")
    public ResponseEntity<RecommendationSessionDto> getLatestSession(
            @RequestHeader("X-User-Id") Integer userId,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String direction) {
        return ResponseEntity.ok(recommendationService.getLatestSession(userId, sortBy, direction));
    }

    /**
     * GET /api/recommendations/sessions/{sessionTime}
     * Specific session by creation date.
     *
     * Example: /api/recommendations/sessions/2026-05-12T14:30:00
     *
     * Parameters:
     *   sortBy    — score (by default) | countryName
     *   direction — desc (by default) | asc
     */
    @GetMapping("/sessions/{sessionTime}")
    public ResponseEntity<RecommendationSessionDto> getSession(
            @RequestHeader("X-User-Id") Integer userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime sessionTime,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String direction) {
        return ResponseEntity.ok(recommendationService.getSession(userId, sessionTime, sortBy, direction));
    }
}