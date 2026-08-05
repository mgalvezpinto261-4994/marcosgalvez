package com.b2bmatch.notificaciones.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.b2bmatch.notificaciones.dto.CreateNotificationRequest;
import com.b2bmatch.notificaciones.exception.ApiException;
import com.b2bmatch.notificaciones.model.Notification;
import com.b2bmatch.notificaciones.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public Notification create(CreateNotificationRequest request) {
        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<Notification> findMine(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public long countUnread(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public Notification markAsRead(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Notificación no encontrada"));

        if (!notification.getUserId().equals(userId)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Esta notificación no te pertenece");
        }

        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }
}
