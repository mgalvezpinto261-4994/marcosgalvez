package com.b2bmatch.resenias.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.b2bmatch.resenias.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProfessionalIdOrderByCreatedAtDesc(Long professionalId);

    Optional<Review> findByCustomerIdAndProfessionalId(Long customerId, Long professionalId);

    /**
     * Un cliente solo puede reseñar a un profesional si tuvo al menos una
     * cotización aceptada (status ACTIVE) sobre algún servicio de ese
     * profesional. "quotation" y "service" son tablas dueñas del microservicio
     * "ofertas"/"catalogo" respectivamente — se leen vía consulta nativa
     * porque no vale la pena duplicar sus entidades solo para este check.
     */
    @Query(value = """
        SELECT COUNT(*) > 0
        FROM b2bmatch_ofertas.quotation q
        JOIN b2bmatch_catalogo.service s ON s.id = q.service_id
        WHERE q.customer_id = :customerId
          AND s.professional_id = :professionalId
          AND q.status = 'ACTIVE'
        """, nativeQuery = true)
    boolean hasAcceptedEngagement(@Param("customerId") Long customerId, @Param("professionalId") Long professionalId);
}
