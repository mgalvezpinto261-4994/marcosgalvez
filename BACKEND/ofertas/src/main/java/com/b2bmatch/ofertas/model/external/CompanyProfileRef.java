package com.b2bmatch.ofertas.model.external;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Mapeo de solo lectura a "company_profile", tabla dueña del microservicio
 * "usuarios". "ofertas" solo necesita resolver qué company_profile.id le
 * corresponde a un app_user.id (viene en el JWT) — no duplica el resto de
 * columnas ni pretende ser dueño de esta tabla. Mismo patrón de simplificación
 * consciente que "catalogo" usa en CompanyServiceListingView (ver PROGRESO.md).
 */
@Entity
@Table(name = "company_profile", schema = "b2bmatch_perfiles")
@Getter
@Setter
public class CompanyProfileRef {

    @Id
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "company_name")
    private String companyName;
}
