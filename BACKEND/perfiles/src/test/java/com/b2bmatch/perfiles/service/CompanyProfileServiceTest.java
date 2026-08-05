package com.b2bmatch.perfiles.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.b2bmatch.perfiles.dto.CompanyProfileRequest;
import com.b2bmatch.perfiles.exception.ApiException;
import com.b2bmatch.perfiles.model.CompanyProfile;
import com.b2bmatch.perfiles.repository.CompanyProfileRepository;

@ExtendWith(MockitoExtension.class)
class CompanyProfileServiceTest {

    @Mock
    private CompanyProfileRepository companyProfileRepository;

    private CompanyProfileService companyProfileService;

    @BeforeEach
    void setUp() {
        companyProfileService = new CompanyProfileService(companyProfileRepository);
    }

    @Test
    void findMine_throwsWhenNoProfile() {
        when(companyProfileRepository.findByUserId(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> companyProfileService.findMine(1L))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("perfil de empresa");
    }

    @Test
    void updateMine_updatesEditableFields() {
        CompanyProfile existing = new CompanyProfile();
        existing.setId(10L);
        existing.setUserId(1L);
        existing.setCompanyName("Antiguo Nombre");
        existing.setTaxId("76.111.222-3");

        when(companyProfileRepository.findByUserId(1L)).thenReturn(Optional.of(existing));
        when(companyProfileRepository.save(existing)).thenReturn(existing);

        CompanyProfileRequest request = new CompanyProfileRequest();
        request.setCompanyName("Nuevo Nombre");
        request.setIndustry("Consultoría");
        request.setCity("Santiago");

        CompanyProfile updated = companyProfileService.updateMine(1L, request);

        assertThat(updated.getCompanyName()).isEqualTo("Nuevo Nombre");
        assertThat(updated.getIndustry()).isEqualTo("Consultoría");
        assertThat(updated.getCity()).isEqualTo("Santiago");
        assertThat(updated.getTaxId()).isEqualTo("76.111.222-3");
    }
}
