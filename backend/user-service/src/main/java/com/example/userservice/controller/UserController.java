package com.example.userservice.controller;

import com.example.userservice.dto.UserProfileRequest;
import com.example.userservice.dto.UserProfileResponse;
import com.example.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Get the profile of the currently authenticated user.
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getProfileByEmail(userDetails.getUsername()));
    }

    /**
     * Fill in (or update) the survey/questionnaire for the current user.
     */
    @PutMapping("/me/profile")
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserProfileRequest request) {

        UserProfileResponse profile = userService.getProfileByEmail(userDetails.getUsername());
        return ResponseEntity.ok(userService.saveProfile(profile.getId(), request));
    }

    /**
     * Get profile by ID — used internally by other services.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getProfile(id));
    }
}