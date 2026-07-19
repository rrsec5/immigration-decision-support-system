package com.example.userservice.controller;

import com.example.userservice.entity.FinancialLevel;
import com.example.userservice.entity.Language;
import com.example.userservice.entity.Profession;
import com.example.userservice.service.ReferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReferenceController {

    private final ReferenceService referenceService;

    @GetMapping("/api/languages")
    public ResponseEntity<List<Language>> getLanguages() {
        return ResponseEntity.ok(referenceService.getAllLanguages());
    }

    @GetMapping("/api/professions")
    public ResponseEntity<List<Profession>> getProfessions() {
        return ResponseEntity.ok(referenceService.getAllProfessions());
    }

    @GetMapping("/api/financial-levels")
    public ResponseEntity<List<FinancialLevel>> getFinancialLevels() {
        return ResponseEntity.ok(referenceService.getAllFinancialLevels());
    }
}