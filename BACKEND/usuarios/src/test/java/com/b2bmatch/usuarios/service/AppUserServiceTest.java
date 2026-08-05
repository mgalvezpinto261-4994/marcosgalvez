package com.b2bmatch.usuarios.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.b2bmatch.usuarios.dto.LoginRequest;
import com.b2bmatch.usuarios.dto.RegisterRequest;
import com.b2bmatch.usuarios.exception.AuthException;
import com.b2bmatch.usuarios.model.AppUser;
import com.b2bmatch.usuarios.model.Role;
import com.b2bmatch.usuarios.repository.AppUserRepository;
import com.b2bmatch.usuarios.repository.CompanyProfileRepository;
import com.b2bmatch.usuarios.repository.CustomerProfileRepository;
import com.b2bmatch.usuarios.repository.ProfessionalProfileRepository;
import com.b2bmatch.usuarios.repository.RoleRepository;
import com.b2bmatch.usuarios.security.JwtService;

@ExtendWith(MockitoExtension.class)
class AppUserServiceTest {

    @Mock
    private AppUserRepository appUserRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private CustomerProfileRepository customerProfileRepository;
    @Mock
    private ProfessionalProfileRepository professionalProfileRepository;
    @Mock
    private CompanyProfileRepository companyProfileRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;

    private AppUserService appUserService;

    @BeforeEach
    void setUp() {
        appUserService = new AppUserService(
                appUserRepository,
                roleRepository,
                customerProfileRepository,
                professionalProfileRepository,
                companyProfileRepository,
                passwordEncoder,
                jwtService);
    }

    private RegisterRequest customerRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("juan@example.com");
        request.setPassword("password123");
        request.setRole("CUSTOMER");
        request.setFirstName("Juan");
        request.setLastName("Pérez");
        return request;
    }

    @Test
    void register_rejectsDuplicateEmail() {
        RegisterRequest request = customerRequest();
        when(appUserRepository.existsByEmail(request.getEmail())).thenReturn(true);

        assertThatThrownBy(() -> appUserService.register(request))
                .isInstanceOf(AuthException.class)
                .hasMessageContaining("Ya existe una cuenta");
    }

    @Test
    void register_rejectsCompanyWithoutRequiredFields() {
        RegisterRequest request = customerRequest();
        request.setRole("COMPANY");
        request.setFirstName(null);
        request.setLastName(null);
        when(appUserRepository.existsByEmail(request.getEmail())).thenReturn(false);

        assertThatThrownBy(() -> appUserService.register(request))
                .isInstanceOf(AuthException.class)
                .hasMessageContaining("companyName");
    }

    @Test
    void register_createsCustomerAndReturnsToken() {
        RegisterRequest request = customerRequest();
        Role customerRole = new Role();
        customerRole.setId(2L);
        customerRole.setName("CUSTOMER");

        when(appUserRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(roleRepository.findByName("CUSTOMER")).thenReturn(Optional.of(customerRole));
        when(passwordEncoder.encode(request.getPassword())).thenReturn("hashed");
        when(appUserRepository.save(any(AppUser.class))).thenAnswer(invocation -> {
            AppUser user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });
        when(jwtService.generateToken(1L, request.getEmail(), "CUSTOMER")).thenReturn("fake-jwt");

        var response = appUserService.register(request);

        assertThat(response.getToken()).isEqualTo("fake-jwt");
        assertThat(response.getUserId()).isEqualTo(1L);
        assertThat(response.getRole()).isEqualTo("CUSTOMER");
        assertThat(response.getDisplayName()).isEqualTo("Juan Pérez");
    }

    @Test
    void login_rejectsWrongPassword() {
        LoginRequest request = new LoginRequest();
        request.setEmail("juan@example.com");
        request.setPassword("wrong");

        AppUser user = new AppUser();
        user.setId(1L);
        user.setEmail(request.getEmail());
        user.setPasswordHash("hashed");
        user.setStatus("ACTIVE");

        when(appUserRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.getPassword(), user.getPasswordHash())).thenReturn(false);

        assertThatThrownBy(() -> appUserService.login(request))
                .isInstanceOf(AuthException.class)
                .hasMessageContaining("incorrectos");
    }

    @Test
    void login_rejectsUnknownEmail() {
        LoginRequest request = new LoginRequest();
        request.setEmail("no-existe@example.com");
        request.setPassword("password123");

        when(appUserRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> appUserService.login(request))
                .isInstanceOf(AuthException.class)
                .hasMessageContaining("incorrectos");
    }
}
