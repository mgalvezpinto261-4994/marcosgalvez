package com.b2bmatch.resenias.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.b2bmatch.resenias.dto.ReviewRequest;
import com.b2bmatch.resenias.dto.ReviewResponse;
import com.b2bmatch.resenias.service.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/professionals/{professionalId}/reviews")
@CrossOrigin(origins = { "http://localhost:5173" })
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public List<ReviewResponse> findForProfessional(@PathVariable Long professionalId) {
        return reviewService.findForProfessional(professionalId);
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ReviewResponse create(
            @AuthenticationPrincipal Long customerUserId,
            @PathVariable Long professionalId,
            @Valid @RequestBody ReviewRequest request) {
        return reviewService.create(customerUserId, professionalId, request);
    }
}
