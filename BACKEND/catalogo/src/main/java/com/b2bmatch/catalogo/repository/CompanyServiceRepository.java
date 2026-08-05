package com.b2bmatch.catalogo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.b2bmatch.catalogo.model.CompanyService;
import com.b2bmatch.catalogo.model.CompanyServiceListingView;

public interface CompanyServiceRepository extends JpaRepository<CompanyService, Long> {

    @Query(value = """
        SELECT cs.id AS id,
               cs.title AS title,
               cs.description AS description,
               cs.price AS price,
               cs.status AS status,
               c.name AS categoryName,
               cp.company_name AS companyName,
               cp.city AS companyCity
        FROM b2bmatch_catalogo.company_service cs
        JOIN b2bmatch_catalogo.category c ON c.id = cs.category_id
        JOIN b2bmatch_perfiles.company_profile cp ON cp.id = cs.company_id
        WHERE cs.status = 'ACTIVE'
        ORDER BY cs.created_at DESC
        """, nativeQuery = true)
    List<CompanyServiceListingView> findActiveListings();

    List<CompanyService> findByCompanyIdOrderByCreatedAtDesc(Long companyId);
}
