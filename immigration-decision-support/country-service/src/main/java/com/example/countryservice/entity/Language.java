package com.example.countryservice.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "language")
@Data
public class Language {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;
}