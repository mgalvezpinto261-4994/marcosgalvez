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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.b2bmatch.ofertas.dto.JobOfferRequest;
import com.b2bmatch.ofertas.dto.JobOfferResponse;
import com.b2bmatch.ofertas.service.JobOfferService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/job-offers")
@CrossOrigin(origins = { "http://localhost:5173" })
@RequiredArgsConstructor
public class JobOfferController {

    private final JobOfferService jobOfferService;

    @GetMapping
    public List<JobOfferResponse> findActive() {
        return jobOfferService.findActive();
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('COMPANY')")
    public List<JobOfferResponse> findMine(@AuthenticationPrincipal Long companyUserId) {
        return jobOfferService.findMine(companyUserId);
    }

    @GetMapping("/{id}")
    public JobOfferResponse findById(@PathVariable Long id) {
        return jobOfferService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    public JobOfferResponse create(@AuthenticationPrincipal Long companyUserId, @Valid @RequestBody JobOfferRequest request) {
        return jobOfferService.create(companyUserId, request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY')")
    public JobOfferResponse update(
            @AuthenticationPrincipal Long companyUserId,
            @PathVariable Long id,
            @Valid @RequestBody JobOfferRequest request) {
        return jobOfferService.update(companyUserId, id, request);
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('COMPANY')")
    public JobOfferResponse close(@AuthenticationPrincipal Long companyUserId, @PathVariable Long id) {
        return jobOfferService.close(companyUserId, id);
    }
}
