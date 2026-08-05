package com.b2bmatch.ofertas.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.b2bmatch.ofertas.model.JobOffer;

public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {

    List<JobOffer> findByStatusOrderByCreatedAtDesc(String status);

    List<JobOffer> findByCompanyIdOrderByCreatedAtDesc(Long companyId);

    List<JobOffer> findAllByOrderByCreatedAtDesc();
}
