package com.b2bmatch.ofertas.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.b2bmatch.ofertas.dto.QuotationRequest;
import com.b2bmatch.ofertas.dto.QuotationResponse;
import com.b2bmatch.ofertas.dto.QuotationStatusRequest;
import com.b2bmatch.ofertas.service.QuotationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = { "http://localhost:5173" })
@RequiredArgsConstructor
public class QuotationController {

    private final QuotationService quotationService;

    @PostMapping("/api/services/{serviceId}/quotations")
    @PreAuthorize("hasRole('CUSTOMER')")
    public QuotationResponse create(
            @AuthenticationPrincipal Long customerUserId,
            @PathVariable Long serviceId,
            @Valid @RequestBody QuotationRequest request) {
        return quotationService.create(customerUserId, serviceId, request);
    }

    @GetMapping("/api/services/{serviceId}/quotations")
    @PreAuthorize("hasRole('PROFESSIONAL')")
    public List<QuotationResponse> findForService(
            @AuthenticationPrincipal Long professionalUserId,
            @PathVariable Long serviceId) {
        return quotationService.findForService(professionalUserId, serviceId);
    }

    @GetMapping("/api/quotations/mine")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<QuotationResponse> findMine(@AuthenticationPrincipal Long customerUserId) {
        return quotationService.findMine(customerUserId);
    }

    @PutMapping("/api/quotations/{id}/status")
    @PreAuthorize("hasRole('PROFESSIONAL')")
    public QuotationResponse updateStatus(
            @AuthenticationPrincipal Long professionalUserId,
            @PathVariable Long id,
            @Valid @RequestBody QuotationStatusRequest request) {
        return quotationService.updateStatus(professionalUserId, id, request.getStatus());
    }
}
