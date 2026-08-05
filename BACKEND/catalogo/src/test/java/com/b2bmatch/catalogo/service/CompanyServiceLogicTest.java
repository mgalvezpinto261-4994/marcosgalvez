package com.b2bmatch.catalogo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.b2bmatch.catalogo.dto.CompanyServiceRequest;
import com.b2bmatch.catalogo.exception.ApiException;
import com.b2bmatch.catalogo.model.CompanyService;
import com.b2bmatch.catalogo.model.external.CompanyProfileRef;
import com.b2bmatch.catalogo.repository.CompanyServiceRepository;
import com.b2bmatch.catalogo.repository.external.CompanyProfileRefRepository;

@ExtendWith(MockitoExtension.class)
class CompanyServiceLogicTest {

    @Mock
    private CompanyServiceRepository companyServiceRepository;
    @Mock
    private CompanyProfileRefRepository companyProfileRefRepository;

    private CompanyServiceLogic companyServiceLogic;

    @BeforeEach
    void setUp() {
        companyServiceLogic = new CompanyServiceLogic(companyServiceRepository, companyProfileRefRepository);
    }

    private CompanyServiceRequest request() {
        CompanyServiceRequest request = new CompanyServiceRequest();
        request.setCategoryId(1L);
        request.setTitle("Auditoría contable");
        request.setDescription("Revisión completa de estados financieros");
        request.setPrice(new BigDecimal("300000"));
        return request;
    }

    @Test
    void create_rejectsUserWithoutCompanyProfile() {
        when(companyProfileRefRepository.findByUserId(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> companyServiceLogic.create(1L, request()))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("perfil de empresa");
    }

    @Test
    void create_savesServiceLinkedToCompanyProfile() {
        CompanyProfileRef company = new CompanyProfileRef();
        company.setId(5L);
        company.setUserId(1L);
        when(companyProfileRefRepository.findByUserId(1L)).thenReturn(Optional.of(company));
        when(companyServiceRepository.save(any(CompanyService.class))).thenAnswer(invocation -> {
            CompanyService service = invocation.getArgument(0);
            service.setId(9L);
            return service;
        });

        var result = companyServiceLogic.create(1L, request());

        assertThat(result.getId()).isEqualTo(9L);
        assertThat(result.getCompanyId()).isEqualTo(5L);
        assertThat(result.getStatus()).isEqualTo("ACTIVE");
    }
}
