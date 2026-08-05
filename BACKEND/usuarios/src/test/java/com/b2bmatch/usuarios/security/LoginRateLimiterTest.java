package com.b2bmatch.usuarios.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class LoginRateLimiterTest {

    @Test
    void allowsUpToTheLimitThenBlocks() {
        LoginRateLimiter limiter = new LoginRateLimiter();
        String key = "127.0.0.1";

        for (int i = 0; i < 10; i++) {
            assertThat(limiter.isAllowed(key)).isTrue();
        }

        assertThat(limiter.isAllowed(key)).isFalse();
    }

    @Test
    void tracksDifferentKeysIndependently() {
        LoginRateLimiter limiter = new LoginRateLimiter();

        for (int i = 0; i < 10; i++) {
            limiter.isAllowed("client-a");
        }

        assertThat(limiter.isAllowed("client-a")).isFalse();
        assertThat(limiter.isAllowed("client-b")).isTrue();
    }
}
