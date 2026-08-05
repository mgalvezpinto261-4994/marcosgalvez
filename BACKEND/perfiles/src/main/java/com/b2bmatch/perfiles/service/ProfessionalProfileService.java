package com.b2bmatch.perfiles.service;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.b2bmatch.perfiles.dto.ProfessionalProfileRequest;
import com.b2bmatch.perfiles.exception.ApiException;
import com.b2bmatch.perfiles.model.ProfessionalProfile;
import com.b2bmatch.perfiles.repository.ProfessionalProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfessionalProfileService {

    private final ProfessionalProfileRepository professionalProfileRepository;

    @Transactional(readOnly = true)
    public ProfessionalProfile findById(Long id) {
        return professionalProfileRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Perfil profesional no encontrado"));
    }

    @Transactional(readOnly = true)
    public ProfessionalProfile findMine(Long userId) {
        return professionalProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Esta cuenta no tiene un perfil profesional"));
    }

    @Transactional
    public ProfessionalProfile updateMine(Long userId, ProfessionalProfileRequest request) {
        ProfessionalProfile profile = findMine(userId);
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setPhone(request.getPhone());
        profile.setBiography(request.getBiography());
        profile.setExperienceYears(request.getExperienceYears());
        profile.setHourlyRate(request.getHourlyRate());
        profile.setPortfolioUrl(request.getPortfolioUrl());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setCity(request.getCity());
        profile.setCountry(request.getCountry());
        profile.setUpdatedAt(LocalDateTime.now());
        return professionalProfileRepository.save(profile);
    }
}
