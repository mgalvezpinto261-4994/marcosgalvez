package com.b2bmatch.catalogo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.b2bmatch.catalogo.dto.CompanyServiceRequest;
import com.b2bmatch.catalogo.exception.ApiException;
import com.b2bmatch.catalogo.model.CompanyService;
import com.b2bmatch.catalogo.model.CompanyServiceListingView;
import com.b2bmatch.catalogo.model.external.CompanyProfileRef;
import com.b2bmatch.catalogo.repository.CompanyServiceRepository;
import com.b2bmatch.catalogo.repository.external.CompanyProfileRefRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyServiceLogic {

    private final CompanyServiceRepository companyServiceRepository;
    private final CompanyProfileRefRepository companyProfileRefRepository;

    @Transactional(readOnly = true)
    public List<CompanyServiceListingView> findActiveListings() {
        return companyServiceRepository.findActiveListings();
    }

    @Transactional(readOnly = true)
    public List<CompanyService> findMine(Long companyUserId) {
        CompanyProfileRef company = companyProfileRefRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "Esta cuenta no tiene un perfil de empresa"));
        return companyServiceRepository.findByCompanyIdOrderByCreatedAtDesc(company.getId());
    }

    @Transactional
    public CompanyService create(Long companyUserId, CompanyServiceRequest request) {
        CompanyProfileRef company = companyProfileRefRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "Esta cuenta no tiene un perfil de empresa"));

        CompanyService service = new CompanyService();
        service.setCompanyId(company.getId());
        service.setCategoryId(request.getCategoryId());
        service.setTitle(request.getTitle());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setStatus("ACTIVE");
        service.setCreatedAt(LocalDateTime.now());
        return companyServiceRepository.save(service);
    }
}
