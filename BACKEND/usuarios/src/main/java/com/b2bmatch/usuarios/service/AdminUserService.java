package com.b2bmatch.usuarios.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.b2bmatch.usuarios.dto.AdminUserResponse;
import com.b2bmatch.usuarios.exception.AuthException;
import com.b2bmatch.usuarios.model.AppUser;
import com.b2bmatch.usuarios.repository.AppUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AppUserRepository appUserRepository;

    @Transactional(readOnly = true)
    public List<AdminUserResponse> findAll() {
        return appUserRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AdminUserResponse updateStatus(Long userId, String newStatus) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new AuthException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        user.setStatus(newStatus);
        user.setUpdatedAt(LocalDateTime.now());
        user = appUserRepository.save(user);

        return toResponse(user);
    }

    private AdminUserResponse toResponse(AppUser user) {
        return new AdminUserResponse(
                user.getId(),
                user.getEmail(),
                user.getRole().getName(),
                user.getStatus(),
                user.getCreatedAt());
    }
}
