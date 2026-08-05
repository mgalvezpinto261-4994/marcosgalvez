package com.b2bmatch.catalogo.repository.external;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.b2bmatch.catalogo.model.external.CompanyProfileRef;

public interface CompanyProfileRefRepository extends JpaRepository<CompanyProfileRef, Long> {

    Optional<CompanyProfileRef> findByUserId(Long userId);
}
