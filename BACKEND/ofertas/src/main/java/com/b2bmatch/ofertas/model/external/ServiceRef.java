package com.b2bmatch.ofertas.model.external;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Mapeo de solo lectura a "service" (servicios de profesionales, dueña:
 * microservicio "catalogo"). Solo para saber qué professional_profile.id es
 * dueño de un servicio al validar/mostrar cotizaciones.
 */
@Entity
@Table(name = "service")
@Getter
@Setter
public class ServiceRef {

    @Id
    private Long id;

    @Column(name = "professional_id")
    private Long professionalId;

    @Column
    private String title;

    @Column
    private String status;
}
