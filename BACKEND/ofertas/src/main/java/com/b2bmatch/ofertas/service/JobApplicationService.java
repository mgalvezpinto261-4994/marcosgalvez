package com.b2bmatch.ofertas.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.b2bmatch.ofertas.dto.JobApplicationRequest;
import com.b2bmatch.ofertas.dto.JobApplicationResponse;
import com.b2bmatch.ofertas.exception.ApiException;
import com.b2bmatch.ofertas.model.JobApplication;
import com.b2bmatch.ofertas.model.JobOffer;
import com.b2bmatch.ofertas.model.external.ProfessionalProfileRef;
import com.b2bmatch.ofertas.notification.NotificationClient;
import com.b2bmatch.ofertas.repository.JobApplicationRepository;
import com.b2bmatch.ofertas.repository.external.CompanyProfileRefRepository;
import com.b2bmatch.ofertas.repository.external.ProfessionalProfileRefRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final ProfessionalProfileRefRepository professionalProfileRefRepository;
    private final CompanyProfileRefRepository companyProfileRefRepository;
    private final JobOfferService jobOfferService;
    private final NotificationClient notificationClient;

    @Transactional
    public JobApplicationResponse apply(Long professionalUserId, Long jobOfferId, JobApplicationRequest request) {
        ProfessionalProfileRef professional = professionalProfileRefRepository.findByUserId(professionalUserId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "Esta cuenta no tiene un perfil profesional"));

        JobOffer offer = jobOfferService.getOrThrow(jobOfferId);
        if (!"ACTIVE".equals(offer.getStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "Esta oferta ya no está activa");
        }

        if (jobApplicationRepository.findByJobOfferIdAndProfessionalId(jobOfferId, professional.getId()).isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "Ya postulaste a esta oferta");
        }

        JobApplication application = new JobApplication();
        application.setJobOfferId(jobOfferId);
        application.setProfessionalId(professional.getId());
        application.setProposal(request.getProposal());
        application.setExpectedPrice(request.getExpectedPrice());
        application.setStatus("PENDING");
        application.setCreatedAt(LocalDateTime.now());
        application = jobApplicationRepository.save(application);

        companyProfileRefRepository.findById(offer.getCompanyId()).ifPresent(company ->
                notificationClient.notify(
                        company.getUserId(),
                        "Nueva postulación",
                        professionalName(professional) + " postuló a tu oferta \"" + offer.getTitle() + "\""));

        return toResponse(application, professionalName(professional));
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> findForOffer(Long companyUserId, Long jobOfferId) {
        JobOffer offer = jobOfferService.getOrThrow(jobOfferId);
        jobOfferService.assertOwnedBy(offer, companyUserId);

        return jobApplicationRepository.findByJobOfferIdOrderByCreatedAtDesc(jobOfferId).stream()
                .map(app -> toResponse(app, professionalName(app.getProfessionalId())))
                .toList();
    }

    @Transactional
    public JobApplicationResponse updateStatus(Long companyUserId, Long jobOfferId, Long applicationId, String newStatus) {
        JobOffer offer = jobOfferService.getOrThrow(jobOfferId);
        jobOfferService.assertOwnedBy(offer, companyUserId);

        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Postulación no encontrada"));

        if (!application.getJobOfferId().equals(jobOfferId)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Esta postulación no pertenece a esta oferta");
        }

        application.setStatus(newStatus);
        application.setUpdatedAt(LocalDateTime.now());
        application = jobApplicationRepository.save(application);

        professionalProfileRefRepository.findById(application.getProfessionalId()).ifPresent(professional -> {
            String statusLabel = "ACCEPTED".equals(newStatus) ? "aceptada" : "rechazada";
            notificationClient.notify(
                    professional.getUserId(),
                    "Actualización de tu postulación",
                    "Tu postulación a \"" + offer.getTitle() + "\" fue " + statusLabel);
        });

        return toResponse(application, professionalName(application.getProfessionalId()));
    }

    @Transactional(readOnly = true)
    public List<JobApplicationResponse> findMine(Long professionalUserId) {
        ProfessionalProfileRef professional = professionalProfileRefRepository.findByUserId(professionalUserId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "Esta cuenta no tiene un perfil profesional"));

        return jobApplicationRepository.findByProfessionalIdOrderByCreatedAtDesc(professional.getId()).stream()
                .map(app -> toResponse(app, professionalName(professional)))
                .toList();
    }

    private String professionalName(Long professionalId) {
        return professionalProfileRefRepository.findById(professionalId)
                .map(this::professionalName)
                .orElse("Profesional");
    }

    private String professionalName(ProfessionalProfileRef professional) {
        return professional.getFirstName() + " " + professional.getLastName();
    }

    private JobApplicationResponse toResponse(JobApplication application, String professionalName) {
        return new JobApplicationResponse(
                application.getId(),
                application.getJobOfferId(),
                application.getProfessionalId(),
                professionalName,
                application.getProposal(),
                application.getExpectedPrice(),
                application.getStatus(),
                application.getCreatedAt());
    }
}
