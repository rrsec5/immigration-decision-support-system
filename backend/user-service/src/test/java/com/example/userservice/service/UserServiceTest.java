package com.example.userservice.service;

import com.example.userservice.dto.UserProfileRequest;
import com.example.userservice.dto.UserProfileResponse;
import com.example.userservice.entity.FinancialLevel;
import com.example.userservice.entity.Profession;
import com.example.userservice.entity.User;
import com.example.userservice.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private FinancialLevelRepository financialLevelRepository;

    @Mock
    private ProfessionRepository professionRepository;

    @Mock
    private LanguageRepository languageRepository;

    @Mock
    private UserLanguageSkillRepository userLanguageSkillRepository;


    @InjectMocks
    private UserService userService;


    private User user;
    private FinancialLevel financialLevel;
    private Profession profession;


    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1);
        user.setEmail("test@mail.com");

        financialLevel = new FinancialLevel();
        financialLevel.setId(1);
        financialLevel.setAmount(50000);

        profession = new Profession();
        profession.setId(1);
        profession.setName("Software Engineer");
    }

    @Test
    void getProfile_shouldReturnUserProfile() {

        when(userRepository.findById(1))
                .thenReturn(Optional.of(user));

        UserProfileResponse response =
                userService.getProfile(1);

        assertEquals(1, response.getId());

        assertEquals("test@mail.com", response.getEmail());

        verify(userRepository)
                .findById(1);
    }

    @Test
    void getProfile_shouldThrowException_whenUserNotFound() {

        when(userRepository.findById(1))
                .thenReturn(Optional.empty());

        assertThrows(
                IllegalArgumentException.class,
                () -> userService.getProfile(1)
        );

        verify(userRepository)
                .findById(1);
    }

    @Test
    void saveProfile_shouldUpdateUserProfile() {

        when(userRepository.findById(1))
                .thenReturn(Optional.of(user));

        when(financialLevelRepository.findById(1))
                .thenReturn(Optional.of(financialLevel));

        when(professionRepository.findById(1))
                .thenReturn(Optional.of(profession));

        UserProfileRequest request =
                new UserProfileRequest();

        request.setFinancialLevelId(1);
        request.setProfessionId(1);
        request.setWorkExperience(3);

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        UserProfileResponse response =
                userService.saveProfile(1, request);

        assertEquals(
                1,
                response.getFinancialLevelId()
        );

        assertEquals(
                1,
                response.getProfessionId()
        );

        assertEquals(
                3,
                response.getWorkExperience()
        );

        verify(userRepository)
                .save(user);

        verify(userLanguageSkillRepository)
                .deleteByIdUserId(1);
    }

    @Test
    void saveProfile_shouldThrowException_whenFinancialLevelNotFound() {

        when(userRepository.findById(1))
                .thenReturn(Optional.of(user));

        when(financialLevelRepository.findById(1))
                .thenReturn(Optional.empty());

        UserProfileRequest request =
                new UserProfileRequest();

        request.setFinancialLevelId(1);
        request.setProfessionId(1);

        assertThrows(
                IllegalArgumentException.class,
                () -> userService.saveProfile(1, request)
        );

        verify(professionRepository, never())
                .findById(anyInt());
    }


    @Test
    void getProfileByEmail_shouldReturnProfile() {

        when(userRepository.findByEmail("test@mail.com"))
                .thenReturn(Optional.of(user));

        UserProfileResponse response =
                userService.getProfileByEmail(
                        "test@mail.com"
                );

        assertEquals(
                "test@mail.com",
                response.getEmail()
        );

        verify(userRepository)
                .findByEmail("test@mail.com");
    }
}
