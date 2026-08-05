package com.b2bmatch.perfiles.service;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.b2bmatch.perfiles.dto.CompanyProfileRequest;
import com.b2bmatch.perfiles.exception.ApiException;
import com.b2bmatch.perfiles.model.CompanyProfile;
import com.b2bmatch.perfiles.repository.CompanyProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyProfileService {

    private final CompanyProfileRepository companyProfileRepository;

    @Transactional(readOnly = true)
    public java.util.List<CompanyProfile> findAll() {
        return companyProfileRepository.findAll();
    }

    @Transactional(readOnly = true)
    public CompanyProfile findById(Long id) {
        return companyProfileRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Perfil de empresa no encontrado"));
    }

    @Transactional(readOnly = true)
    public CompanyProfile findMine(Long userId) {
        return companyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Esta cuenta no tiene un perfil de empresa"));
    }

    @Transactional
    public CompanyProfile updateMine(Long userId, CompanyProfileRequest request) {
        CompanyProfile profile = findMine(userId);
        profile.setCompanyName(request.getCompanyName());
        profile.setIndustry(request.getIndustry());
        profile.setWebsite(request.getWebsite());
        profile.setEmail(request.getEmail());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setCountry(request.getCountry());
        profile.setCompanyDescription(request.getCompanyDescription());
        profile.setLogoUrl(request.getLogoUrl());
        profile.setUpdatedAt(LocalDateTime.now());
        return companyProfileRepository.save(profile);
    }
}
