package com.b2bmatch.ofertas.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuotationStatusRequest {

    @Pattern(regexp = "ACTIVE|INACTIVE", message = "status debe ser ACTIVE (aceptar) o INACTIVE (rechazar)")
    private String status;
}
