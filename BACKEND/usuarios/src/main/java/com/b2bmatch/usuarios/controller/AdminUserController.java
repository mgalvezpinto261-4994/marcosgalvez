package com.b2bmatch.usuarios.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.b2bmatch.usuarios.dto.AdminUserResponse;
import com.b2bmatch.usuarios.dto.UserStatusRequest;
import com.b2bmatch.usuarios.service.AdminUserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = { "http://localhost:5173" })
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public List<AdminUserResponse> findAll() {
        return adminUserService.findAll();
    }

    @PutMapping("/{id}/status")
    public AdminUserResponse updateStatus(@PathVariable Long id, @Valid @RequestBody UserStatusRequest request) {
        return adminUserService.updateStatus(id, request.getStatus());
    }
}
