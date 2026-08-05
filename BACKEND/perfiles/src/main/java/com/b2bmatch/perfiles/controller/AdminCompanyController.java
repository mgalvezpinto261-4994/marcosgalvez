package com.b2bmatch.perfiles.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.b2bmatch.perfiles.model.CompanyProfile;
import com.b2bmatch.perfiles.service.CompanyProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/company-profiles")
@CrossOrigin(origins = { "http://localhost:5173" })
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCompanyController {

    private final CompanyProfileService companyProfileService;

    @GetMapping
    public List<CompanyProfile> findAll() {
        return companyProfileService.findAll();
    }
}
