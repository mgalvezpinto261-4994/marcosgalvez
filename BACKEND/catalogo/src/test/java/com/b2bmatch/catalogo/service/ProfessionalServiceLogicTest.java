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

import com.b2bmatch.catalogo.dto.ProfessionalServiceRequest;
import com.b2bmatch.catalogo.exception.ApiException;
import com.b2bmatch.catalogo.model.ProfessionalService;
import com.b2bmatch.catalogo.model.external.ProfessionalProfileRef;
import com.b2bmatch.catalogo.repository.ProfessionalServiceRepository;
import com.b2bmatch.catalogo.repository.external.ProfessionalProfileRefRepository;

@ExtendWith(MockitoExtension.class)
class ProfessionalServiceLogicTest {

    @Mock
    private ProfessionalServiceRepository professionalServiceRepository;
    @Mock
    private ProfessionalProfileRefRepository professionalProfileRefRepository;

    private ProfessionalServiceLogic professionalServiceLogic;

    @BeforeEach
    void setUp() {
        professionalServiceLogic = new ProfessionalServiceLogic(professionalServiceRepository, professionalProfileRefRepository);
    }

    private ProfessionalServiceRequest request() {
        ProfessionalServiceRequest request = new ProfessionalServiceRequest();
        request.setCategoryId(1L);
        request.setTitle("Diseño de logo");
        request.setDescription("Identidad visual completa");
        request.setPrice(new BigDecimal("150000"));
        return request;
    }

    @Test
    void create_rejectsUserWithoutProfessionalProfile() {
        when(professionalProfileRefRepository.findByUserId(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> professionalServiceLogic.create(1L, request()))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("perfil profesional");
    }

    @Test
    void create_savesServiceLinkedToProfessionalProfile() {
        ProfessionalProfileRef professional = new ProfessionalProfileRef();
        professional.setId(7L);
        professional.setUserId(1L);
        when(professionalProfileRefRepository.findByUserId(1L)).thenReturn(Optional.of(professional));
        when(professionalServiceRepository.save(any(ProfessionalService.class))).thenAnswer(invocation -> {
            ProfessionalService service = invocation.getArgument(0);
            service.setId(3L);
            return service;
        });

        var result = professionalServiceLogic.create(1L, request());

        assertThat(result.getId()).isEqualTo(3L);
        assertThat(result.getProfessionalId()).isEqualTo(7L);
        assertThat(result.getStatus()).isEqualTo("ACTIVE");
    }
}
