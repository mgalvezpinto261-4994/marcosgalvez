package com.b2bmatch.usuarios.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.b2bmatch.usuarios.dto.AdminRegisterRequest;
import com.b2bmatch.usuarios.dto.AuthResponse;
import com.b2bmatch.usuarios.dto.LoginRequest;
import com.b2bmatch.usuarios.dto.RegisterRequest;
import com.b2bmatch.usuarios.exception.AuthException;
import com.b2bmatch.usuarios.security.LoginRateLimiter;
import com.b2bmatch.usuarios.service.AppUserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:5173" })
@RequiredArgsConstructor
public class AuthController {

    private final AppUserService appUserService;
    private final LoginRateLimiter loginRateLimiter;

    @Value("${admin.bootstrap-key}")
    private String adminBootstrapKey;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return appUserService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String clientIp = httpRequest.getRemoteAddr();
        if (!loginRateLimiter.isAllowed(clientIp)) {
            throw new AuthException(HttpStatus.TOO_MANY_REQUESTS, "Demasiados intentos de inicio de sesión. Intenta de nuevo en un minuto.");
        }
        return appUserService.login(request);
    }

    /**
     * No hay registro público de ADMIN a propósito (nadie debería poder
     * autoasignarse ese rol). Este endpoint crea la cuenta admin solo si quien
     * llama conoce la clave compartida configurada vía ADMIN_BOOTSTRAP_KEY —
     * pensado para usarse una vez por ambiente, no como flujo de usuario final.
     */
    @PostMapping("/register-admin")
    public AuthResponse registerAdmin(
            @RequestHeader("X-Admin-Bootstrap-Key") String providedKey,
            @Valid @RequestBody AdminRegisterRequest request) {
        if (adminBootstrapKey == null || adminBootstrapKey.isBlank() || !adminBootstrapKey.equals(providedKey)) {
            throw new AuthException(HttpStatus.FORBIDDEN, "Clave de bootstrap inválida");
        }
        return appUserService.registerAdmin(request);
    }
}
