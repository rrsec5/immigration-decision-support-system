package com.example.userservice.service;

import com.example.userservice.dto.AuthResponse;
import com.example.userservice.dto.LoginRequest;
import com.example.userservice.dto.RegisterRequest;
import com.example.userservice.entity.User;
import com.example.userservice.repository.UserRepository;
import com.example.userservice.security.JwtService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsService userDetailsService;

    @InjectMocks
    private AuthService authService;

    @Test
    void shouldRegisterUserSuccessfully() {

        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@mail.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail(request.getEmail()))
                .thenReturn(false);


        when(passwordEncoder.encode(request.getPassword()))
                .thenReturn("encodedPassword");

        when(userDetailsService.loadUserByUsername(request.getEmail()))
                .thenReturn(
                        org.springframework.security.core.userdetails.User
                                .builder()
                                .username(request.getEmail())
                                .password("encodedPassword")
                                .roles("USER")
                                .build()
                );

        when(jwtService.generateToken(any(UserDetails.class)))
                .thenReturn("jwt-token");

        AuthResponse response =
                authService.register(request);

        assertEquals(
                "jwt-token",
                response.getToken()
        );

        assertEquals(
                "test@mail.com",
                response.getEmail()
        );

        assertFalse(
                response.isProfileComplete()
        );

        verify(userRepository)
                .save(any(User.class));

        verify(passwordEncoder)
                .encode("password123");

        verify(jwtService)
                .generateToken(any(UserDetails.class));
    }

    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {

        RegisterRequest request = new RegisterRequest();

        request.setEmail("test@mail.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail(request.getEmail()))
                .thenReturn(true);

        assertThrows(
                IllegalArgumentException.class,
                () -> authService.register(request)
        );

        verify(userRepository, never())
                .save(any());
    }


    @Test
    void shouldLoginSuccessfully() {

        LoginRequest request = new LoginRequest();

        request.setEmail("test@mail.com");
        request.setPassword("password123");

        User user = new User();

        user.setId(1);
        user.setEmail("test@mail.com");

        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.of(user));

        when(userDetailsService.loadUserByUsername(request.getEmail()))
                .thenReturn(
                        org.springframework.security.core.userdetails.User
                                .builder()
                                .username(request.getEmail())
                                .password("encoded")
                                .roles("USER")
                                .build()
                );

        when(jwtService.generateToken(any(UserDetails.class)))
                .thenReturn("jwt-token");

        AuthResponse response =
                authService.login(request);

        assertEquals(
                "jwt-token",
                response.getToken()
        );

        assertFalse(
                response.isProfileComplete()
        );

        verify(authenticationManager)
                .authenticate(any());
    }

    @Test
    void login_shouldReturnProfileIncomplete_whenUserHasNoProfile() {

        LoginRequest request = new LoginRequest();
        request.setEmail("new@test.com");
        request.setPassword("password123");

        User user = new User();
        user.setId(1);
        user.setEmail("new@test.com");
        user.setPassword("encoded-password");

        UserDetails userDetails =
                org.springframework.security.core.userdetails.User
                        .builder()
                        .username(user.getEmail())
                        .password(user.getPassword())
                        .roles("USER")
                        .build();

        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.of(user));

        when(userDetailsService.loadUserByUsername(user.getEmail()))
                .thenReturn(userDetails);

        when(jwtService.generateToken(userDetails))
                .thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertEquals("jwt-token", response.getToken());
        assertEquals(1, response.getUserId());
        assertEquals("new@test.com", response.getEmail());

        assertFalse(response.isProfileComplete());

        verify(authenticationManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
}
