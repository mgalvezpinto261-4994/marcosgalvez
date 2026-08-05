package com.b2bmatch.ofertas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.b2bmatch.ofertas.dto.JobApplicationRequest;
import com.b2bmatch.ofertas.exception.ApiException;
import com.b2bmatch.ofertas.model.JobApplication;
import com.b2bmatch.ofertas.model.JobOffer;
import com.b2bmatch.ofertas.model.external.ProfessionalProfileRef;
import com.b2bmatch.ofertas.notification.NotificationClient;
import com.b2bmatch.ofertas.repository.JobApplicationRepository;
import com.b2bmatch.ofertas.repository.external.CompanyProfileRefRepository;
import com.b2bmatch.ofertas.repository.external.ProfessionalProfileRefRepository;

@ExtendWith(MockitoExtension.class)
class JobApplicationServiceTest {

    @Mock
    private JobApplicationRepository jobApplicationRepository;
    @Mock
    private ProfessionalProfileRefRepository professionalProfileRefRepository;
    @Mock
    private CompanyProfileRefRepository companyProfileRefRepository;
    @Mock
    private JobOfferService jobOfferService;
    @Mock
    private NotificationClient notificationClient;

    private JobApplicationService jobApplicationService;

    @BeforeEach
    void setUp() {
        jobApplicationService = new JobApplicationService(
                jobApplicationRepository, professionalProfileRefRepository, companyProfileRefRepository,
                jobOfferService, notificationClient);
    }

    private JobApplicationRequest request() {
        JobApplicationRequest request = new JobApplicationRequest();
        request.setProposal("Puedo hacer este trabajo");
        request.setExpectedPrice(new java.math.BigDecimal("100000"));
        return request;
    }

    private ProfessionalProfileRef professionalRef(long id, long userId) {
        ProfessionalProfileRef ref = new ProfessionalProfileRef();
        ref.setId(id);
        ref.setUserId(userId);
        ref.setFirstName("Juan");
        ref.setLastName("Pérez");
        return ref;
    }

    private JobOffer activeOffer(long id) {
        JobOffer offer = new JobOffer();
        offer.setId(id);
        offer.setStatus("ACTIVE");
        return offer;
    }

    @Test
    void apply_rejectsUserWithoutProfessionalProfile() {
        when(professionalProfileRefRepository.findByUserId(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobApplicationService.apply(1L, 1L, request()))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("perfil profesional");
    }

    @Test
    void apply_rejectsInactiveOffer() {
        ProfessionalProfileRef professional = professionalRef(5L, 1L);
        when(professionalProfileRefRepository.findByUserId(1L)).thenReturn(Optional.of(professional));

        JobOffer offer = activeOffer(1L);
        offer.setStatus("INACTIVE");
        when(jobOfferService.getOrThrow(1L)).thenReturn(offer);

        assertThatThrownBy(() -> jobApplicationService.apply(1L, 1L, request()))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("ya no está activa");
    }

    @Test
    void apply_rejectsDuplicateApplication() {
        ProfessionalProfileRef professional = professionalRef(5L, 1L);
        when(professionalProfileRefRepository.findByUserId(1L)).thenReturn(Optional.of(professional));
        when(jobOfferService.getOrThrow(1L)).thenReturn(activeOffer(1L));
        when(jobApplicationRepository.findByJobOfferIdAndProfessionalId(1L, 5L))
                .thenReturn(Optional.of(new JobApplication()));

        assertThatThrownBy(() -> jobApplicationService.apply(1L, 1L, request()))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("Ya postulaste");
    }

    @Test
    void apply_savesApplicationSuccessfully() {
        ProfessionalProfileRef professional = professionalRef(5L, 1L);
        when(professionalProfileRefRepository.findByUserId(1L)).thenReturn(Optional.of(professional));
        when(jobOfferService.getOrThrow(1L)).thenReturn(activeOffer(1L));
        when(jobApplicationRepository.findByJobOfferIdAndProfessionalId(1L, 5L)).thenReturn(Optional.empty());
        when(jobApplicationRepository.save(any(JobApplication.class))).thenAnswer(invocation -> {
            JobApplication app = invocation.getArgument(0);
            app.setId(9L);
            return app;
        });

        var response = jobApplicationService.apply(1L, 1L, request());

        assertThat(response.getId()).isEqualTo(9L);
        assertThat(response.getProfessionalId()).isEqualTo(5L);
        assertThat(response.getProfessionalName()).isEqualTo("Juan Pérez");
        assertThat(response.getStatus()).isEqualTo("PENDING");
    }

    @Test
    void updateStatus_acceptsApplicationBelongingToOffer() {
        JobOffer offer = activeOffer(1L);
        when(jobOfferService.getOrThrow(1L)).thenReturn(offer);

        JobApplication application = new JobApplication();
        application.setId(9L);
        application.setJobOfferId(1L);
        application.setProfessionalId(5L);
        when(jobApplicationRepository.findById(9L)).thenReturn(Optional.of(application));
        when(jobApplicationRepository.save(any(JobApplication.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = jobApplicationService.updateStatus(1L, 1L, 9L, "ACCEPTED");

        assertThat(response.getStatus()).isEqualTo("ACCEPTED");
    }

    @Test
    void updateStatus_rejectsApplicationFromAnotherOffer() {
        JobOffer offer = activeOffer(1L);
        when(jobOfferService.getOrThrow(1L)).thenReturn(offer);

        JobApplication application = new JobApplication();
        application.setId(9L);
        application.setJobOfferId(2L);
        when(jobApplicationRepository.findById(9L)).thenReturn(Optional.of(application));

        assertThatThrownBy(() -> jobApplicationService.updateStatus(1L, 1L, 9L, "ACCEPTED"))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("no pertenece");
    }
}
