package com.b2bmatch.catalogo.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.b2bmatch.catalogo.dto.CompanyServiceRequest;
import com.b2bmatch.catalogo.model.CompanyService;
import com.b2bmatch.catalogo.model.CompanyServiceListingView;
import com.b2bmatch.catalogo.service.CompanyServiceLogic;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/company-services")
@CrossOrigin(origins = { "http://localhost:5173" })
@RequiredArgsConstructor
public class CompanyServiceController {

    private final CompanyServiceLogic companyServiceLogic;

    @GetMapping
    public List<CompanyServiceListingView> findAll() {
        return companyServiceLogic.findActiveListings();
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('COMPANY')")
    public List<CompanyService> findMine(@AuthenticationPrincipal Long companyUserId) {
        return companyServiceLogic.findMine(companyUserId);
    }

    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    public CompanyService create(@AuthenticationPrincipal Long companyUserId, @Valid @RequestBody CompanyServiceRequest request) {
        return companyServiceLogic.create(companyUserId, request);
    }
}
