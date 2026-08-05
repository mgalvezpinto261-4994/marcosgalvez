package com.b2bmatch.perfiles.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfessionalProfileRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    private String phone;
    private String biography;
    private Integer experienceYears;
    private BigDecimal hourlyRate;
    private String portfolioUrl;
    private String linkedinUrl;
    private String githubUrl;
    private String city;
    private String country;
}
