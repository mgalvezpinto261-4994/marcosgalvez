package com.b2bmatch.catalogo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.b2bmatch.catalogo.model.ProfessionalService;
import com.b2bmatch.catalogo.model.ProfessionalServiceListingView;

public interface ProfessionalServiceRepository extends JpaRepository<ProfessionalService, Long> {

    @Query(value = """
        SELECT s.id AS id,
               s.title AS title,
               s.description AS description,
               s.price AS price,
               s.status AS status,
               c.name AS categoryName,
               CONCAT(pp.first_name, ' ', pp.last_name) AS professionalName,
               pp.city AS professionalCity
        FROM b2bmatch_catalogo.service s
        JOIN b2bmatch_catalogo.category c ON c.id = s.category_id
        JOIN b2bmatch_perfiles.professional_profile pp ON pp.id = s.professional_id
        WHERE s.status = 'ACTIVE'
        ORDER BY s.created_at DESC
        """, nativeQuery = true)
    List<ProfessionalServiceListingView> findActiveListings();

    List<ProfessionalService> findByProfessionalIdOrderByCreatedAtDesc(Long professionalId);
}
