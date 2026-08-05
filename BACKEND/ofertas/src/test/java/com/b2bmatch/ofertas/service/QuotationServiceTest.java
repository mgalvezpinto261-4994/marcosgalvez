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

import com.b2bmatch.ofertas.dto.QuotationRequest;
import com.b2bmatch.ofertas.exception.ApiException;
import com.b2bmatch.ofertas.model.Quotation;
import com.b2bmatch.ofertas.model.external.CustomerProfileRef;
import com.b2bmatch.ofertas.model.external.ProfessionalProfileRef;
import com.b2bmatch.ofertas.model.external.ServiceRef;
import com.b2bmatch.ofertas.notification.NotificationClient;
import com.b2bmatch.ofertas.repository.QuotationRepository;
import com.b2bmatch.ofertas.repository.external.CustomerProfileRefRepository;
import com.b2bmatch.ofertas.repository.external.ProfessionalProfileRefRepository;
import com.b2bmatch.ofertas.repository.external.ServiceRefRepository;

@ExtendWith(MockitoExtension.class)
class QuotationServiceTest {

    @Mock
    private QuotationRepository quotationRepository;
    @Mock
    private CustomerProfileRefRepository customerProfileRefRepository;
    @Mock
    private ProfessionalProfileRefRepository professionalProfileRefRepository;
    @Mock
    private ServiceRefRepository serviceRefRepository;
    @Mock
    private NotificationClient notificationClient;

    private QuotationService quotationService;

    @BeforeEach
    void setUp() {
        quotationService = new QuotationService(
                quotationRepository, customerProfileRefRepository, professionalProfileRefRepository,
                serviceRefRepository, notificationClient);
    }

    private ServiceRef activeService(long id, long professionalId) {
        ServiceRef service = new ServiceRef();
        service.setId(id);
        service.setProfessionalId(professionalId);
        service.setTitle("Landing page");
        service.setStatus("ACTIVE");
        return service;
    }

    private CustomerProfileRef customerRef(long id, long userId) {
        CustomerProfileRef ref = new CustomerProfileRef();
        ref.setId(id);
        ref.setUserId(userId);
        ref.setFirstName("Carlos");
        ref.setLastName("Cliente");
        return ref;
    }

    @Test
    void create_rejectsUserWithoutCustomerProfile() {
        when(customerProfileRefRepository.findByUserId(1L)).thenReturn(Optional.empty());

        QuotationRequest request = new QuotationRequest();
        request.setMessage("Hola");

        assertThatThrownBy(() -> quotationService.create(1L, 1L, request))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("perfil de cliente");
    }

    @Test
    void create_rejectsInactiveService() {
        when(customerProfileRefRepository.findByUserId(1L)).thenReturn(Optional.of(customerRef(3L, 1L)));
        ServiceRef inactive = activeService(1L, 7L);
        inactive.setStatus("INACTIVE");
        when(serviceRefRepository.findById(1L)).thenReturn(Optional.of(inactive));

        QuotationRequest request = new QuotationRequest();
        request.setMessage("Hola");

        assertThatThrownBy(() -> quotationService.create(1L, 1L, request))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("ya no está activo");
    }

    @Test
    void create_savesQuotationAsPending() {
        when(customerProfileRefRepository.findByUserId(1L)).thenReturn(Optional.of(customerRef(3L, 1L)));
        when(serviceRefRepository.findById(1L)).thenReturn(Optional.of(activeService(1L, 7L)));
        when(quotationRepository.save(any(Quotation.class))).thenAnswer(invocation -> {
            Quotation q = invocation.getArgument(0);
            q.setId(5L);
            return q;
        });

        QuotationRequest request = new QuotationRequest();
        request.setMessage("Necesito una landing page");

        var response = quotationService.create(1L, 1L, request);

        assertThat(response.getId()).isEqualTo(5L);
        assertThat(response.getStatus()).isEqualTo("PENDING");
        assertThat(response.getCustomerId()).isEqualTo(3L);
    }

    @Test
    void updateStatus_rejectsWhenServiceBelongsToAnotherProfessional() {
        Quotation quotation = new Quotation();
        quotation.setId(1L);
        quotation.setServiceId(1L);
        when(quotationRepository.findById(1L)).thenReturn(Optional.of(quotation));
        when(serviceRefRepository.findById(1L)).thenReturn(Optional.of(activeService(1L, 7L)));

        ProfessionalProfileRef otherProfessional = new ProfessionalProfileRef();
        otherProfessional.setId(99L);
        otherProfessional.setUserId(2L);
        when(professionalProfileRefRepository.findByUserId(2L)).thenReturn(Optional.of(otherProfessional));

        assertThatThrownBy(() -> quotationService.updateStatus(2L, 1L, "ACTIVE"))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("no te pertenece");
    }
}
