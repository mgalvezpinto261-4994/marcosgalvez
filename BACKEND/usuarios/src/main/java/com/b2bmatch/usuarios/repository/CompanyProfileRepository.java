package com.b2bmatch.usuarios.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.b2bmatch.usuarios.model.CompanyProfile;

public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Long> {

    boolean existsByTaxId(String taxId);

    Optional<CompanyProfile> findByUserId(Long userId);
}
