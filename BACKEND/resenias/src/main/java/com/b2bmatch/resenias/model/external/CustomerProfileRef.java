package com.b2bmatch.resenias.model.external;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Mapeo de solo lectura a "customer_profile" (dueña: "perfiles"/"usuarios").
 */
@Entity
@Table(name = "customer_profile")
@Getter
@Setter
public class CustomerProfileRef {

    @Id
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;
}
