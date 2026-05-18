package com.example.userservice.repository;

import com.example.userservice.entity.FinancialLevel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FinancialLevelRepository extends JpaRepository<FinancialLevel, Integer> {
}