package com.b2bmatch.perfiles.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.b2bmatch.perfiles.dto.ProfessionalProfileRequest;
import com.b2bmatch.perfiles.model.ProfessionalProfile;
import com.b2bmatch.perfiles.service.ProfessionalProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/professional-profiles")
@CrossOrigin(origins = { "http://localhost:5173" })
@RequiredArgsConstructor
public class ProfessionalProfileController {

    private final ProfessionalProfileService professionalProfileService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('PROFESSIONAL')")
    public ProfessionalProfile findMine(@AuthenticationPrincipal Long userId) {
        return professionalProfileService.findMine(userId);
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('PROFESSIONAL')")
    public ProfessionalProfile updateMine(@AuthenticationPrincipal Long userId, @Valid @RequestBody ProfessionalProfileRequest request) {
        return professionalProfileService.updateMine(userId, request);
    }

    @GetMapping("/{id}")
    public ProfessionalProfile findById(@PathVariable Long id) {
        return professionalProfileService.findById(id);
    }
}
