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

import com.b2bmatch.ofertas.dto.JobApplicationRequest;
import com.b2bmatch.ofertas.dto.JobApplicationResponse;
import com.b2bmatch.ofertas.dto.JobApplicationStatusRequest;
import com.b2bmatch.ofertas.service.JobApplicationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin(origins = { "http://localhost:5173" })
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @PostMapping("/api/job-offers/{jobOfferId}/applications")
    @PreAuthorize("hasRole('PROFESSIONAL')")
    public JobApplicationResponse apply(
            @AuthenticationPrincipal Long professionalUserId,
            @PathVariable Long jobOfferId,
            @Valid @RequestBody JobApplicationRequest request) {
        return jobApplicationService.apply(professionalUserId, jobOfferId, request);
    }

    @GetMapping("/api/job-offers/{jobOfferId}/applications")
    @PreAuthorize("hasRole('COMPANY')")
    public List<JobApplicationResponse> findForOffer(
            @AuthenticationPrincipal Long companyUserId,
            @PathVariable Long jobOfferId) {
        return jobApplicationService.findForOffer(companyUserId, jobOfferId);
    }

    @GetMapping("/api/applications/mine")
    @PreAuthorize("hasRole('PROFESSIONAL')")
    public List<JobApplicationResponse> findMine(@AuthenticationPrincipal Long professionalUserId) {
        return jobApplicationService.findMine(professionalUserId);
    }

    @PutMapping("/api/job-offers/{jobOfferId}/applications/{applicationId}/status")
    @PreAuthorize("hasRole('COMPANY')")
    public JobApplicationResponse updateStatus(
            @AuthenticationPrincipal Long companyUserId,
            @PathVariable Long jobOfferId,
            @PathVariable Long applicationId,
            @Valid @RequestBody JobApplicationStatusRequest request) {
        return jobApplicationService.updateStatus(companyUserId, jobOfferId, applicationId, request.getStatus());
    }
}
