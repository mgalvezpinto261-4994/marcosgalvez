package com.b2bmatch.ofertas.repository.external;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.b2bmatch.ofertas.model.external.CompanyProfileRef;

public interface CompanyProfileRefRepository extends JpaRepository<CompanyProfileRef, Long> {

    Optional<CompanyProfileRef> findByUserId(Long userId);
}
