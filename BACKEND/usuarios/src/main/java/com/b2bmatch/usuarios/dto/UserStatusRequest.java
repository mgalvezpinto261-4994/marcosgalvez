package com.b2bmatch.usuarios.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserStatusRequest {

    @Pattern(regexp = "ACTIVE|SUSPENDED", message = "status debe ser ACTIVE o SUSPENDED")
    private String status;
}
