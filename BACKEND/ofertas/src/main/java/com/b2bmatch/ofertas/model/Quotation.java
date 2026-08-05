package com.b2bmatch.ofertas.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "quotation")
@Getter
@Setter
public class Quotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "service_id", nullable = false)
    private Long serviceId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(columnDefinition = "TEXT")
    private String message;

    /**
     * El CHECK constraint de la tabla solo permite ACTIVE/PENDING/SUSPENDED/
     * INACTIVE/DELETED (mismo vocabulario que job_offer/company_service, no
     * pensado originalmente para un flujo de cotización). Se reutiliza así:
     * PENDING (recién solicitada) -> ACTIVE (aceptada por el profesional) o
     * INACTIVE (rechazada).
     */
    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
