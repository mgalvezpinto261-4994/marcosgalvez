package com.b2bmatch.catalogo.model;

import java.math.BigDecimal;

/**
 * Read-only projection joining "service" with category and
 * professional_profile (owned by perfiles/usuarios) — mismo patrón que
 * CompanyServiceListingView.
 */
public interface ProfessionalServiceListingView {
    Long getId();
    String getTitle();
    String getDescription();
    BigDecimal getPrice();
    String getStatus();
    String getCategoryName();
    String getProfessionalName();
    String getProfessionalCity();
}
