package com.b2bmatch.notificaciones.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.b2bmatch.notificaciones.dto.CreateNotificationRequest;
import com.b2bmatch.notificaciones.exception.ApiException;
import com.b2bmatch.notificaciones.model.Notification;
import com.b2bmatch.notificaciones.repository.NotificationRepository;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        notificationService = new NotificationService(notificationRepository);
    }

    @Test
    void create_savesNotificationAsUnread() {
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> {
            Notification n = invocation.getArgument(0);
            n.setId(1L);
            return n;
        });

        CreateNotificationRequest request = new CreateNotificationRequest();
        request.setUserId(5L);
        request.setTitle("Nueva postulación");
        request.setMessage("Alguien postuló a tu oferta");

        Notification result = notificationService.create(request);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getUserId()).isEqualTo(5L);
        assertThat(result.getIsRead()).isFalse();
    }

    @Test
    void markAsRead_rejectsNotificationBelongingToAnotherUser() {
        Notification notification = new Notification();
        notification.setId(1L);
        notification.setUserId(5L);
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));

        assertThatThrownBy(() -> notificationService.markAsRead(99L, 1L))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("no te pertenece");
    }

    @Test
    void markAsRead_marksOwnNotificationAsRead() {
        Notification notification = new Notification();
        notification.setId(1L);
        notification.setUserId(5L);
        notification.setIsRead(false);
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Notification result = notificationService.markAsRead(5L, 1L);

        assertThat(result.getIsRead()).isTrue();
    }
}
