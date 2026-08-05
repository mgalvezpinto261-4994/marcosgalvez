package com.b2bmatch.ofertas.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.b2bmatch.ofertas.model.JobApplication;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByJobOfferIdOrderByCreatedAtDesc(Long jobOfferId);

    List<JobApplication> findByProfessionalIdOrderByCreatedAtDesc(Long professionalId);

    Optional<JobApplication> findByJobOfferIdAndProfessionalId(Long jobOfferId, Long professionalId);
}
