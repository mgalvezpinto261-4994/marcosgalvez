package com.b2bmatch.ofertas.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JobOfferResponse {

    private Long id;
    private Long companyId;
    private String companyName;
    private Long categoryId;
    private String title;
    private String description;
    private BigDecimal budget;
    private LocalDate deadline;
    private String status;
    private LocalDateTime createdAt;
    private long applicationCount;
}
