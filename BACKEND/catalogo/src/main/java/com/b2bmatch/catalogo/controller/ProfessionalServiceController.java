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

import com.b2bmatch.catalogo.dto.ProfessionalServiceRequest;
import com.b2bmatch.catalogo.model.ProfessionalService;
import com.b2bmatch.catalogo.model.ProfessionalServiceListingView;
import com.b2bmatch.catalogo.service.ProfessionalServiceLogic;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/professional-services")
@CrossOrigin(origins = { "http://localhost:5173" })
@RequiredArgsConstructor
public class ProfessionalServiceController {

    private final ProfessionalServiceLogic professionalServiceLogic;

    @GetMapping
    public List<ProfessionalServiceListingView> findAll() {
        return professionalServiceLogic.findActiveListings();
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('PROFESSIONAL')")
    public List<ProfessionalService> findMine(@AuthenticationPrincipal Long professionalUserId) {
        return professionalServiceLogic.findMine(professionalUserId);
    }

    @PostMapping
    @PreAuthorize("hasRole('PROFESSIONAL')")
    public ProfessionalService create(@AuthenticationPrincipal Long professionalUserId, @Valid @RequestBody ProfessionalServiceRequest request) {
        return professionalServiceLogic.create(professionalUserId, request);
    }
}
