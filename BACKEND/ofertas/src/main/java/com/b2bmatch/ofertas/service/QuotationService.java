package com.b2bmatch.ofertas.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.b2bmatch.ofertas.dto.QuotationRequest;
import com.b2bmatch.ofertas.dto.QuotationResponse;
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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuotationService {

    private final QuotationRepository quotationRepository;
    private final CustomerProfileRefRepository customerProfileRefRepository;
    private final ProfessionalProfileRefRepository professionalProfileRefRepository;
    private final ServiceRefRepository serviceRefRepository;
    private final NotificationClient notificationClient;

    @Transactional
    public QuotationResponse create(Long customerUserId, Long serviceId, QuotationRequest request) {
        CustomerProfileRef customer = customerProfileRefRepository.findByUserId(customerUserId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "Esta cuenta no tiene un perfil de cliente"));

        ServiceRef service = serviceRefRepository.findById(serviceId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Servicio no encontrado"));

        if (!"ACTIVE".equals(service.getStatus())) {
            throw new ApiException(HttpStatus.CONFLICT, "Este servicio ya no está activo");
        }

        Quotation quotation = new Quotation();
        quotation.setServiceId(serviceId);
        quotation.setCustomerId(customer.getId());
        quotation.setMessage(request.getMessage());
        quotation.setStatus("PENDING");
        quotation.setCreatedAt(LocalDateTime.now());
        quotation = quotationRepository.save(quotation);

        professionalProfileRefRepository.findById(service.getProfessionalId()).ifPresent(professional ->
                notificationClient.notify(
                        professional.getUserId(),
                        "Nueva cotización",
                        customerName(customer) + " cotizó tu servicio \"" + service.getTitle() + "\""));

        return toResponse(quotation, service, customerName(customer));
    }

    @Transactional(readOnly = true)
    public List<QuotationResponse> findForService(Long professionalUserId, Long serviceId) {
        ServiceRef service = getServiceOwnedBy(professionalUserId, serviceId);
        return quotationRepository.findByServiceIdOrderByCreatedAtDesc(serviceId).stream()
                .map(q -> toResponse(q, service, customerName(q.getCustomerId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<QuotationResponse> findMine(Long customerUserId) {
        CustomerProfileRef customer = customerProfileRefRepository.findByUserId(customerUserId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "Esta cuenta no tiene un perfil de cliente"));

        return quotationRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId()).stream()
                .map(q -> toResponse(q, serviceRef(q.getServiceId()), customerName(customer)))
                .toList();
    }

    @Transactional
    public QuotationResponse updateStatus(Long professionalUserId, Long quotationId, String newStatus) {
        Quotation quotation = quotationRepository.findById(quotationId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Cotización no encontrada"));

        ServiceRef service = getServiceOwnedBy(professionalUserId, quotation.getServiceId());

        quotation.setStatus(newStatus);
        quotation.setUpdatedAt(LocalDateTime.now());
        quotation = quotationRepository.save(quotation);

        customerProfileRefRepository.findById(quotation.getCustomerId()).ifPresent(customer -> {
            String statusLabel = "ACTIVE".equals(newStatus) ? "aceptada" : "rechazada";
            notificationClient.notify(
                    customer.getUserId(),
                    "Actualización de tu cotización",
                    "Tu cotización para \"" + service.getTitle() + "\" fue " + statusLabel);
        });

        return toResponse(quotation, service, customerName(quotation.getCustomerId()));
    }

    private ServiceRef getServiceOwnedBy(Long professionalUserId, Long serviceId) {
        ServiceRef service = serviceRefRepository.findById(serviceId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Servicio no encontrado"));

        ProfessionalProfileRef professional = professionalProfileRefRepository.findByUserId(professionalUserId)
                .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "Esta cuenta no tiene un perfil profesional"));

        if (!professional.getId().equals(service.getProfessionalId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Este servicio no te pertenece");
        }
        return service;
    }

    private String customerName(CustomerProfileRef customer) {
        return customer.getFirstName() + " " + customer.getLastName();
    }

    private String customerName(Long customerId) {
        return customerProfileRefRepository.findById(customerId)
                .map(this::customerName)
                .orElse("Cliente");
    }

    private ServiceRef serviceRef(Long serviceId) {
        return serviceRefRepository.findById(serviceId).orElseGet(() -> {
            ServiceRef fallback = new ServiceRef();
            fallback.setId(serviceId);
            fallback.setTitle("Servicio");
            return fallback;
        });
    }

    private QuotationResponse toResponse(Quotation quotation, ServiceRef service, String customerName) {
        return new QuotationResponse(
                quotation.getId(),
                quotation.getServiceId(),
                service.getTitle(),
                service.getProfessionalId(),
                quotation.getCustomerId(),
                customerName,
                quotation.getMessage(),
                quotation.getStatus(),
                quotation.getCreatedAt());
    }
}
