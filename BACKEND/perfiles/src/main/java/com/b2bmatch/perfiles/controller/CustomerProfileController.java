package com.b2bmatch.perfiles.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.b2bmatch.perfiles.dto.CustomerProfileRequest;
import com.b2bmatch.perfiles.model.CustomerProfile;
import com.b2bmatch.perfiles.service.CustomerProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customer-profiles")
@CrossOrigin(origins = { "http://localhost:5173" })
@RequiredArgsConstructor
public class CustomerProfileController {

    private final CustomerProfileService customerProfileService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public CustomerProfile findMine(@AuthenticationPrincipal Long userId) {
        return customerProfileService.findMine(userId);
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public CustomerProfile updateMine(@AuthenticationPrincipal Long userId, @Valid @RequestBody CustomerProfileRequest request) {
        return customerProfileService.updateMine(userId, request);
    }
}
