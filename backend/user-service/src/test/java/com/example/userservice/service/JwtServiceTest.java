package com.example.userservice.service;

import com.example.userservice.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.User;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;

public class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() throws Exception {

        jwtService = new JwtService();

        Field secret =
                JwtService.class.getDeclaredField("secretKey");

        secret.setAccessible(true);

        secret.set(
                jwtService,
                "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY="
        );

        Field expiration =
                JwtService.class.getDeclaredField("jwtExpiration");

        expiration.setAccessible(true);

        expiration.set(
                jwtService,
                86400000L
        );
    }

    @Test
    void generateToken_shouldCreateValidTokenAndExtractUsername() {

        UserDetails userDetails =
                User.builder()
                        .username("test@mail.com")
                        .password("password")
                        .roles("USER")
                        .build();

        String token =
                jwtService.generateToken(userDetails);

        String username =
                jwtService.extractUsername(token);

        assertNotNull(token);

        assertEquals(
                "test@mail.com",
                username
        );
    }


    @Test
    void isTokenValid_shouldReturnTrue_forCorrectUser() {

        UserDetails userDetails =
                User.builder()
                        .username("test@mail.com")
                        .password("password")
                        .roles("USER")
                        .build();

        String token =
                jwtService.generateToken(userDetails);

        boolean result =
                jwtService.isTokenValid(
                        token,
                        userDetails
                );

        assertTrue(result);
    }
}
