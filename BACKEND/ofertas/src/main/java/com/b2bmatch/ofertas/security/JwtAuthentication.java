package com.b2bmatch.ofertas.security;

import java.util.List;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import lombok.Getter;

/**
 * Representa a un usuario autenticado vía el JWT emitido por "usuarios".
 * El "principal" es el userId (app_user.id) — no hay lookup a una base de
 * usuarios local porque este microservicio no es dueño de esa tabla.
 */
@Getter
public class JwtAuthentication extends AbstractAuthenticationToken {

    private final Long userId;
    private final String email;

    public JwtAuthentication(Long userId, String email, String role) {
        super(List.of(new SimpleGrantedAuthority("ROLE_" + role)));
        this.userId = userId;
        this.email = email;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return userId;
    }
}
