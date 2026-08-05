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

import com.b2bmatch.perfiles.dto.CompanyProfileRequest;
import com.b2bmatch.perfiles.model.CompanyProfile;
import com.b2bmatch.perfiles.service.CompanyProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/company-profiles")
@CrossOrigin(origins = { "http://localhost:5173" })
@RequiredArgsConstructor
public class CompanyProfileController {

    private final CompanyProfileService companyProfileService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('COMPANY')")
    public CompanyProfile findMine(@AuthenticationPrincipal Long userId) {
        return companyProfileService.findMine(userId);
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('COMPANY')")
    public CompanyProfile updateMine(@AuthenticationPrincipal Long userId, @Valid @RequestBody CompanyProfileRequest request) {
        return companyProfileService.updateMine(userId, request);
    }

    @GetMapping("/{id}")
    public CompanyProfile findById(@PathVariable Long id) {
        return companyProfileService.findById(id);
    }
}
