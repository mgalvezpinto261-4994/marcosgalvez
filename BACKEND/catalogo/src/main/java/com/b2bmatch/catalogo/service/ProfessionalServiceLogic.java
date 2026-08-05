package com.b2bmatch.catalogo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.b2bmatch.catalogo.dto.ProfessionalServiceRequest;
import com.b2bmatch.catalogo.exception.ApiException;
import com.b2bmatch.catalogo.model.ProfessionalService;
import com.b2bmatch.catalogo.model.ProfessionalServiceListingView;
import com.b2bmatch.catalogo.model.external.ProfessionalProfileRef;
import com.b2bmatch.catalogo.repository.ProfessionalServiceRepository;
import com.b2bmatch.catalogo.repository.external.ProfessionalProfileRefRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfessionalServiceLogic {

    private final ProfessionalServiceRepository professionalServiceRepository;
    private final ProfessionalProfileRefRepository professionalProfileRefRepository;

    @Transactional(readOnly = true)
    public List<ProfessionalServiceListingView> findActiveListings() {
        return professionalServiceRepository.findActiveListings();
    }

    @Transactional(readOnly = true)
    public List<ProfessionalService> findMine(Long professionalUserId) {
        ProfessionalProfileRef professional = professionalProfileRefRepository.findByUserId(professionalUserId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "Esta cuenta no tiene un perfil profesional"));
        return professionalServiceRepository.findByProfessionalIdOrderByCreatedAtDesc(professional.getId());
    }

    @Transactional
    public ProfessionalService create(Long professionalUserId, ProfessionalServiceRequest request) {
        ProfessionalProfileRef professional = professionalProfileRefRepository.findByUserId(professionalUserId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "Esta cuenta no tiene un perfil profesional"));

        ProfessionalService service = new ProfessionalService();
        service.setProfessionalId(professional.getId());
        service.setCategoryId(request.getCategoryId());
        service.setTitle(request.getTitle());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setStatus("ACTIVE");
        service.setCreatedAt(LocalDateTime.now());
        return professionalServiceRepository.save(service);
    }
}
