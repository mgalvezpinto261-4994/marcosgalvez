package com.b2bmatch.ofertas.model.external;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Mapeo de solo lectura a "professional_profile" (dueña: microservicio
 * "usuarios"). Ver CompanyProfileRef para la razón de este patrón.
 */
@Entity
@Table(name = "professional_profile")
@Getter
@Setter
public class ProfessionalProfileRef {

    @Id
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;
}
