package com.b2bmatch.ofertas.repository.external;

import org.springframework.data.jpa.repository.JpaRepository;

import com.b2bmatch.ofertas.model.external.ServiceRef;

public interface ServiceRefRepository extends JpaRepository<ServiceRef, Long> {
}
