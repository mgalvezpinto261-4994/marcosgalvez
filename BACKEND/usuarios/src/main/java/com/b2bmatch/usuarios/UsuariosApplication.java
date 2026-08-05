package com.b2bmatch.usuarios;

import org.flywaydb.core.Flyway;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UsuariosApplication {

	public static void main(String[] args) {
		runMigrations();
		SpringApplication.run(UsuariosApplication.class, args);
	}

	/**
	 * Spring Boot 4.1.0 todavía no trae auto-configuración de Flyway (no existe
	 * un módulo spring-boot-flyway en el classpath), así que se invoca la API de
	 * Flyway directamente antes de levantar el contexto — así corre siempre
	 * antes de que Hibernate valide el esquema (ddl-auto: validate).
	 */
	// Package-private (no private) para que los tests de integración (@SpringBootTest)
	// puedan invocarla en un @BeforeAll, ya que solo corre automáticamente desde main().
	static void runMigrations() {
		String url = System.getenv().getOrDefault("SPRING_DATASOURCE_URL", "jdbc:postgresql://localhost:5433/b2bmatch");
		String user = System.getenv().getOrDefault("DB_USERNAME", "postgres");
		String password = System.getenv().getOrDefault("DB_PASSWORD", "postgres");
		// "0" asume una base vacía (docker-compose con volumen nuevo): Flyway corre las
		// 18 migraciones desde cero. Si se apunta a una base que YA tiene el schema
		// aplicado a mano (fuera de Flyway, como la del Docker de la Iteración 7), setear
		// FLYWAY_BASELINE_VERSION=18 para que Flyway solo registre el historial sin
		// reintentar crear tablas que ya existen.
		String baselineVersion = System.getenv().getOrDefault("FLYWAY_BASELINE_VERSION", "0");

		Flyway.configure()
				.dataSource(url, user, password)
				.schemas("b2bmatch")
				.defaultSchema("b2bmatch")
				.baselineOnMigrate(true)
				.baselineVersion(baselineVersion)
				.load()
				.migrate();
	}

}
