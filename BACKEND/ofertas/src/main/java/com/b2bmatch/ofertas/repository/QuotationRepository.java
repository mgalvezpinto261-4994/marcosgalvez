package com.b2bmatch.ofertas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.b2bmatch.ofertas.model.Quotation;

public interface QuotationRepository extends JpaRepository<Quotation, Long> {

    List<Quotation> findByServiceIdOrderByCreatedAtDesc(Long serviceId);

    List<Quotation> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}
