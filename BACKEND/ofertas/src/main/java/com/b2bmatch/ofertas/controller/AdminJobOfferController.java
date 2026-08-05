package com.b2bmatch.ofertas.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.b2bmatch.ofertas.dto.JobOfferResponse;
import com.b2bmatch.ofertas.service.JobOfferService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/job-offers")
@CrossOrigin(origins = { "http://localhost:5173" })
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminJobOfferController {

    private final JobOfferService jobOfferService;

    @GetMapping
    public List<JobOfferResponse> findAll() {
        return jobOfferService.findAllForAdmin();
    }
}
