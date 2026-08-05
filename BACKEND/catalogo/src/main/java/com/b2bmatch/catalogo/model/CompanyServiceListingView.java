package com.b2bmatch.catalogo.model;

import java.math.BigDecimal;

/**
 * Read-only projection joining company_service with category and
 * company_profile (owned by the perfiles service) so listings can be
 * displayed without duplicating company/category data as entities here.
 */
public interface CompanyServiceListingView {
    Long getId();
    String getTitle();
    String getDescription();
    BigDecimal getPrice();
    String getStatus();
    String getCategoryName();
    String getCompanyName();
    String getCompanyCity();
}
