package com.example.userservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "financial_level")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FinancialLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "level", unique = true, nullable = false)
    private Integer level;

    @Column(name = "amount", nullable = false)
    private Integer amount;
}