package com.b2bmatch.ofertas.repository.external;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.b2bmatch.ofertas.model.external.CustomerProfileRef;

public interface CustomerProfileRefRepository extends JpaRepository<CustomerProfileRef, Long> {

    Optional<CustomerProfileRef> findByUserId(Long userId);
}
