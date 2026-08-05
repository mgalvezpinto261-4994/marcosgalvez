package com.b2bmatch.usuarios;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class UsuariosApplicationTests {

	// @SpringBootTest arranca el contexto directamente, sin pasar por
	// UsuariosApplication.main() — así que las migraciones de Flyway (que solo
	// corren ahí) hay que dispararlas a mano antes de que Hibernate valide el
	// esquema. Requiere una base Postgres real disponible (ver README/CI).
	@BeforeAll
	static void migrate() {
		UsuariosApplication.runMigrations();
	}

	@Test
	void contextLoads() {
	}

}
