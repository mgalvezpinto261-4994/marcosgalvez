package com.b2bmatch.catalogo.model.external;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Mapeo de solo lectura a "company_profile" (dueña: microservicio "perfiles"/"usuarios").
 * Solo para resolver app_user.id (viene del JWT) -> company_profile.id.
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

    @Column(name = "city")
    private String city;
}
