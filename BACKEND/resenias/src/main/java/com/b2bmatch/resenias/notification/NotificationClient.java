package com.b2bmatch.resenias.notification;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * Llama al microservicio "notificaciones" para avisar de una reseña nueva.
 * Cualquier falla se registra y se ignora — nunca debe tumbar la creación de
 * la reseña, que es la operación principal.
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
