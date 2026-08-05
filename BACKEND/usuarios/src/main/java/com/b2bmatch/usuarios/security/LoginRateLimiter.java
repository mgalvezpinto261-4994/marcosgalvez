package com.b2bmatch.usuarios.security;

import java.time.Duration;
import java.time.Instant;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

import org.springframework.stereotype.Component;

/**
 * Rate limiting en memoria, por IP, para /api/auth/login. Suficiente para un
 * único nodo — si el servicio escala horizontalmente, esto debe moverse a un
 * store compartido (Redis) porque cada instancia tendría su propio contador.
 */
@Component
public class LoginRateLimiter {

    private static final int MAX_ATTEMPTS = 10;
    private static final Duration WINDOW = Duration.ofMinutes(1);

    private final ConcurrentHashMap<String, Deque<Instant>> attemptsByKey = new ConcurrentHashMap<>();

    public boolean isAllowed(String key) {
        Instant now = Instant.now();
        Deque<Instant> attempts = attemptsByKey.computeIfAbsent(key, k -> new ConcurrentLinkedDeque<>());

        synchronized (attempts) {
            while (!attempts.isEmpty() && Duration.between(attempts.peekFirst(), now).compareTo(WINDOW) > 0) {
                attempts.pollFirst();
            }
            if (attempts.size() >= MAX_ATTEMPTS) {
                return false;
            }
            attempts.addLast(now);
            return true;
        }
    }
}
