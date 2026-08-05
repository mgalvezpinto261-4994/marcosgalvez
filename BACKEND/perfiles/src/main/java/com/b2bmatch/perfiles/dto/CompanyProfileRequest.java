package com.b2bmatch.perfiles.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyProfileRequest {

    @NotBlank
    private String companyName;

    private String industry;
    private String website;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String country;
    private String companyDescription;
    private String logoUrl;
}
