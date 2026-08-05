package com.b2bmatch.ofertas.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.b2bmatch.ofertas.dto.JobOfferRequest;
import com.b2bmatch.ofertas.exception.ApiException;
import com.b2bmatch.ofertas.model.JobOffer;
import com.b2bmatch.ofertas.model.external.CompanyProfileRef;
import com.b2bmatch.ofertas.repository.JobApplicationRepository;
import com.b2bmatch.ofertas.repository.JobOfferRepository;
import com.b2bmatch.ofertas.repository.external.CompanyProfileRefRepository;

@ExtendWith(MockitoExtension.class)
class JobOfferServiceTest {

    @Mock
    private JobOfferRepository jobOfferRepository;
    @Mock
    private JobApplicationRepository jobApplicationRepository;
    @Mock
    private CompanyProfileRefRepository companyProfileRefRepository;

    private JobOfferService jobOfferService;

    @BeforeEach
    void setUp() {
        jobOfferService = new JobOfferService(jobOfferRepository, jobApplicationRepository, companyProfileRefRepository);
    }

    private JobOfferRequest request() {
        JobOfferRequest request = new JobOfferRequest();
        request.setCategoryId(1L);
        request.setTitle("Desarrollo de app móvil");
        request.setDescription("Descripción de la oferta");
        request.setBudget(new BigDecimal("2500000"));
        request.setDeadline(LocalDate.now().plusMonths(1));
        return request;
    }

    private CompanyProfileRef companyRef(long id, long userId) {
        CompanyProfileRef ref = new CompanyProfileRef();
        ref.setId(id);
        ref.setUserId(userId);
        ref.setCompanyName("Empresa Test");
        return ref;
    }

    @Test
    void create_rejectsUserWithoutCompanyProfile() {
        when(companyProfileRefRepository.findByUserId(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobOfferService.create(99L, request()))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("perfil de empresa");
    }

    @Test
    void create_savesOfferLinkedToCompanyProfile() {
        CompanyProfileRef company = companyRef(10L, 1L);
        when(companyProfileRefRepository.findByUserId(1L)).thenReturn(Optional.of(company));
        when(jobOfferRepository.save(any(JobOffer.class))).thenAnswer(invocation -> {
            JobOffer offer = invocation.getArgument(0);
            offer.setId(5L);
            return offer;
        });
        when(jobApplicationRepository.findByJobOfferIdOrderByCreatedAtDesc(5L)).thenReturn(List.of());

        var response = jobOfferService.create(1L, request());

        assertThat(response.getId()).isEqualTo(5L);
        assertThat(response.getCompanyId()).isEqualTo(10L);
        assertThat(response.getCompanyName()).isEqualTo("Empresa Test");
        assertThat(response.getStatus()).isEqualTo("ACTIVE");
    }

    @Test
    void assertOwnedBy_rejectsOfferFromAnotherCompany() {
        JobOffer offer = new JobOffer();
        offer.setCompanyId(10L);
        CompanyProfileRef otherCompany = companyRef(20L, 2L);
        when(companyProfileRefRepository.findByUserId(2L)).thenReturn(Optional.of(otherCompany));

        assertThatThrownBy(() -> jobOfferService.assertOwnedBy(offer, 2L))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("no pertenece");
    }

    @Test
    void getOrThrow_throwsWhenOfferMissing() {
        when(jobOfferRepository.findById(404L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobOfferService.getOrThrow(404L))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("no encontrada");
    }

    @Test
    void update_rejectsOfferFromAnotherCompany() {
        JobOffer offer = new JobOffer();
        offer.setId(1L);
        offer.setCompanyId(10L);
        when(jobOfferRepository.findById(1L)).thenReturn(Optional.of(offer));
        when(companyProfileRefRepository.findByUserId(2L)).thenReturn(Optional.of(companyRef(20L, 2L)));

        assertThatThrownBy(() -> jobOfferService.update(2L, 1L, request()))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("no pertenece");
    }

    @Test
    void close_setsStatusToInactive() {
        JobOffer offer = new JobOffer();
        offer.setId(1L);
        offer.setCompanyId(10L);
        offer.setStatus("ACTIVE");
        when(jobOfferRepository.findById(1L)).thenReturn(Optional.of(offer));
        when(companyProfileRefRepository.findByUserId(1L)).thenReturn(Optional.of(companyRef(10L, 1L)));
        when(jobOfferRepository.save(any(JobOffer.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jobApplicationRepository.findByJobOfferIdOrderByCreatedAtDesc(1L)).thenReturn(List.of());

        var response = jobOfferService.close(1L, 1L);

        assertThat(response.getStatus()).isEqualTo("INACTIVE");
    }
}
