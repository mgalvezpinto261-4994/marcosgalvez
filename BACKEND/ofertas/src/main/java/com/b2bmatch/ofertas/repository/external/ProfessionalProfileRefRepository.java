package com.b2bmatch.ofertas.repository.external;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.b2bmatch.ofertas.model.external.ProfessionalProfileRef;

public interface ProfessionalProfileRefRepository extends JpaRepository<ProfessionalProfileRef, Long> {

    Optional<ProfessionalProfileRef> findByUserId(Long userId);
}
