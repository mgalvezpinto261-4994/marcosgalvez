package com.b2bmatch.notificaciones.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.b2bmatch.notificaciones.dto.CreateNotificationRequest;
import com.b2bmatch.notificaciones.exception.ApiException;
import com.b2bmatch.notificaciones.model.Notification;
import com.b2bmatch.notificaciones.service.NotificationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = { "http://localhost:5173" })
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @Value("${internal.service-key}")
    private String internalServiceKey;

    /**
     * Lo llaman otros microservicios (ofertas, resenias) para crear
     * notificaciones en nombre del sistema — no hay un usuario humano detrás
     * de esta llamada, por eso se autentica con una clave compartida en vez
     * de un JWT de usuario.
     */
    @PostMapping("/internal")
    public Notification createInternal(
            @RequestHeader("X-Internal-Service-Key") String providedKey,
            @Valid @RequestBody CreateNotificationRequest request) {
        if (internalServiceKey == null || internalServiceKey.isBlank() || !internalServiceKey.equals(providedKey)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Clave de servicio interna inválida");
        }
        return notificationService.create(request);
    }

    @GetMapping("/mine")
    public List<Notification> findMine(@AuthenticationPrincipal Long userId) {
        return notificationService.findMine(userId);
    }

    @GetMapping("/unread-count")
    public Map<String, Long> countUnread(@AuthenticationPrincipal Long userId) {
        return Map.of("count", notificationService.countUnread(userId));
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        return notificationService.markAsRead(userId, id);
    }
}
