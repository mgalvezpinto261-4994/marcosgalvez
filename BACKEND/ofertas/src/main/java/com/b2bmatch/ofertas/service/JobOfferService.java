package com.b2bmatch.ofertas.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.b2bmatch.ofertas.dto.JobOfferRequest;
import com.b2bmatch.ofertas.dto.JobOfferResponse;
import com.b2bmatch.ofertas.exception.ApiException;
import com.b2bmatch.ofertas.model.JobOffer;
import com.b2bmatch.ofertas.model.external.CompanyProfileRef;
import com.b2bmatch.ofertas.repository.JobApplicationRepository;
import com.b2bmatch.ofertas.repository.JobOfferRepository;
import com.b2bmatch.ofertas.repository.external.CompanyProfileRefRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobOfferService {

    private final JobOfferRepository jobOfferRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final CompanyProfileRefRepository companyProfileRefRepository;

    @Transactional
    public JobOfferResponse create(Long companyUserId, JobOfferRequest request) {
        CompanyProfileRef company = companyProfileRefRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "Esta cuenta no tiene un perfil de empresa"));

        JobOffer offer = new JobOffer();
        offer.setCompanyId(company.getId());
        offer.setCategoryId(request.getCategoryId());
        offer.setTitle(request.getTitle());
        offer.setDescription(request.getDescription());
        offer.setBudget(request.getBudget());
        offer.setDeadline(request.getDeadline());
        offer.setStatus("ACTIVE");
        offer.setCreatedAt(LocalDateTime.now());
        offer = jobOfferRepository.save(offer);

        return toResponse(offer, company.getCompanyName());
    }

    @Transactional(readOnly = true)
    public List<JobOfferResponse> findActive() {
        return jobOfferRepository.findByStatusOrderByCreatedAtDesc("ACTIVE").stream()
                .map(offer -> toResponse(offer, companyName(offer.getCompanyId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public JobOfferResponse findById(Long id) {
        JobOffer offer = getOrThrow(id);
        return toResponse(offer, companyName(offer.getCompanyId()));
    }

    @Transactional(readOnly = true)
    public List<JobOfferResponse> findMine(Long companyUserId) {
        CompanyProfileRef company = companyProfileRefRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "Esta cuenta no tiene un perfil de empresa"));

        return jobOfferRepository.findByCompanyIdOrderByCreatedAtDesc(company.getId()).stream()
                .map(offer -> toResponse(offer, company.getCompanyName()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<JobOfferResponse> findAllForAdmin() {
        return jobOfferRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(offer -> toResponse(offer, companyName(offer.getCompanyId())))
                .toList();
    }

    @Transactional
    public JobOfferResponse update(Long companyUserId, Long offerId, JobOfferRequest request) {
        JobOffer offer = getOrThrow(offerId);
        assertOwnedBy(offer, companyUserId);

        offer.setCategoryId(request.getCategoryId());
        offer.setTitle(request.getTitle());
        offer.setDescription(request.getDescription());
        offer.setBudget(request.getBudget());
        offer.setDeadline(request.getDeadline());
        offer.setUpdatedAt(LocalDateTime.now());
        offer = jobOfferRepository.save(offer);

        return toResponse(offer, companyName(offer.getCompanyId()));
    }

    @Transactional
    public JobOfferResponse close(Long companyUserId, Long offerId) {
        JobOffer offer = getOrThrow(offerId);
        assertOwnedBy(offer, companyUserId);

        offer.setStatus("INACTIVE");
        offer.setUpdatedAt(LocalDateTime.now());
        offer = jobOfferRepository.save(offer);

        return toResponse(offer, companyName(offer.getCompanyId()));
    }

    JobOffer getOrThrow(Long id) {
        return jobOfferRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Oferta no encontrada"));
    }

    void assertOwnedBy(JobOffer offer, Long companyUserId) {
        CompanyProfileRef company = companyProfileRefRepository.findByUserId(companyUserId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "Esta cuenta no tiene un perfil de empresa"));
        if (!offer.getCompanyId().equals(company.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Esta oferta no pertenece a tu empresa");
        }
    }

    private String companyName(Long companyId) {
        return companyProfileRefRepository.findById(companyId)
                .map(CompanyProfileRef::getCompanyName)
                .orElse("Empresa");
    }

    private JobOfferResponse toResponse(JobOffer offer, String companyName) {
        long applicationCount = jobApplicationRepository.findByJobOfferIdOrderByCreatedAtDesc(offer.getId()).size();
        return new JobOfferResponse(
                offer.getId(),
                offer.getCompanyId(),
                companyName,
                offer.getCategoryId(),
                offer.getTitle(),
                offer.getDescription(),
                offer.getBudget(),
                offer.getDeadline(),
                offer.getStatus(),
                offer.getCreatedAt(),
                applicationCount);
    }
}
