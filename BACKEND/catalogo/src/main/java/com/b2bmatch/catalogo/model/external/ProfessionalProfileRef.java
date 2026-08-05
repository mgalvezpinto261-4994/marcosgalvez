package com.b2bmatch.catalogo.model.external;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Mapeo de solo lectura a "professional_profile" (dueña: microservicio
 * "perfiles"/"usuarios"). Solo para resolver app_user.id (viene del JWT) ->
 * professional_profile.id.
 */
@Entity
@Table(name = "professional_profile", schema = "b2bmatch_perfiles")
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

    @Column(name = "city")
    private String city;
}
