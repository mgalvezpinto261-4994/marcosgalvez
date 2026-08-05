package com.b2bmatch.ofertas.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobApplicationStatusRequest {

    @Pattern(regexp = "ACCEPTED|REJECTED", message = "status debe ser ACCEPTED o REJECTED")
    private String status;
}
