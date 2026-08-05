package com.b2bmatch.ofertas.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuotationRequest {

    @NotBlank
    private String message;
}
