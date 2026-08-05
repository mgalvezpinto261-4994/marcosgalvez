package com.b2bmatch.ofertas.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobApplicationRequest {

    @NotBlank
    private String proposal;

    @Positive
    private BigDecimal expectedPrice;
}
