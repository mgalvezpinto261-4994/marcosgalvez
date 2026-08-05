package com.b2bmatch.ofertas.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JobApplicationResponse {

    private Long id;
    private Long jobOfferId;
    private Long professionalId;
    private String professionalName;
    private String proposal;
    private BigDecimal expectedPrice;
    private String status;
    private LocalDateTime createdAt;
}
