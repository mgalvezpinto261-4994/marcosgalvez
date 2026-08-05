package com.b2bmatch.ofertas.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QuotationResponse {

    private Long id;
    private Long serviceId;
    private String serviceTitle;
    private Long professionalId;
    private Long customerId;
    private String customerName;
    private String message;
    private String status;
    private LocalDateTime createdAt;
}
