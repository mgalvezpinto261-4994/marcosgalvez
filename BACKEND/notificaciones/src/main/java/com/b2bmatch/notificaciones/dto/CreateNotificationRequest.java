package com.b2bmatch.notificaciones.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateNotificationRequest {

    @NotNull
    private Long userId;

    @NotBlank
    private String title;

    private String message;
}
