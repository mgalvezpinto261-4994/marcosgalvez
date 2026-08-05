package com.b2bmatch.ofertas.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Llama al microservicio "notificaciones" para avisar eventos (postulación
 * recibida/aceptada, cotización recibida/aceptada). Se autentica con una
 * clave compartida (no hay un usuario humano detrás de esta llamada).
 * Cualquier falla se registra y se ignora — notificar es un efecto secundario,
 * nunca debería tumbar la operación principal (postular, cotizar, etc.).
 */
@Component
public class NotificationClient {

    private static final Logger log = LoggerFactory.getLogger(NotificationClient.class);

    private final RestClient restClient;
    private final String internalServiceKey;

    public NotificationClient(
            @Value("${notifications.api-url}") String notificationsApiUrl,
            @Value("${internal.service-key}") String internalServiceKey) {
        this.restClient = RestClient.create(notificationsApiUrl);
        this.internalServiceKey = internalServiceKey;
    }

    public void notify(Long userId, String title, String message) {
        try {
            restClient.post()
                    .uri("/api/notifications/internal")
                    .header("X-Internal-Service-Key", internalServiceKey)
                    .body(Map.of("userId", userId, "title", title, "message", message))
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception ex) {
            log.warn("No se pudo notificar al usuario {}: {}", userId, ex.getMessage());
        }
    }
}
