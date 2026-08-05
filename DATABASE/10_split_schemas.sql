-- Separación del schema compartido "b2bmatch" en UN SCHEMA POR MICROSERVICIO
-- (paso intermedio hacia database-per-service).
--
-- Ejecutar UNA vez sobre la base local (b2bmatch-postgres):
--   docker exec -i b2bmatch-postgres psql -U postgres -d b2bmatch -v ON_ERROR_STOP=1 < DATABASE/10_split_schemas.sql
--
-- Es atómico (todo en una transacción). El schema "b2bmatch" se CONSERVA
-- porque contiene flyway_schema_history (lo usa el servicio usuarios, que
-- tiene Flyway fijado ahí) y las funciones de pgcrypto (gen_random_uuid).
-- Las foreign keys sobreviven al mudar tablas entre schemas. Las secuencias
-- (serial) viajan automáticamente junto con su tabla al usar SET SCHEMA.

BEGIN;

CREATE SCHEMA IF NOT EXISTS b2bmatch_usuarios;
CREATE SCHEMA IF NOT EXISTS b2bmatch_perfiles;
CREATE SCHEMA IF NOT EXISTS b2bmatch_catalogo;
CREATE SCHEMA IF NOT EXISTS b2bmatch_ofertas;
CREATE SCHEMA IF NOT EXISTS b2bmatch_resenias;
CREATE SCHEMA IF NOT EXISTS b2bmatch_notificaciones;

-- usuarios: app_user, role
ALTER TABLE b2bmatch.app_user SET SCHEMA b2bmatch_usuarios;
ALTER TABLE b2bmatch.role SET SCHEMA b2bmatch_usuarios;

-- perfiles: company/customer/professional_profile
ALTER TABLE b2bmatch.company_profile SET SCHEMA b2bmatch_perfiles;
ALTER TABLE b2bmatch.customer_profile SET SCHEMA b2bmatch_perfiles;
ALTER TABLE b2bmatch.professional_profile SET SCHEMA b2bmatch_perfiles;

-- catalogo: category, service, company_service, skill, professional_skill
ALTER TABLE b2bmatch.category SET SCHEMA b2bmatch_catalogo;
ALTER TABLE b2bmatch.service SET SCHEMA b2bmatch_catalogo;
ALTER TABLE b2bmatch.company_service SET SCHEMA b2bmatch_catalogo;
ALTER TABLE b2bmatch.skill SET SCHEMA b2bmatch_catalogo;
ALTER TABLE b2bmatch.professional_skill SET SCHEMA b2bmatch_catalogo;

-- ofertas: job_offer, application, quotation
ALTER TABLE b2bmatch.job_offer SET SCHEMA b2bmatch_ofertas;
ALTER TABLE b2bmatch.application SET SCHEMA b2bmatch_ofertas;
ALTER TABLE b2bmatch.quotation SET SCHEMA b2bmatch_ofertas;

-- resenias: review
ALTER TABLE b2bmatch.review SET SCHEMA b2bmatch_resenias;

-- notificaciones: notification
ALTER TABLE b2bmatch.notification SET SCHEMA b2bmatch_notificaciones;

COMMIT;

-- Verificación esperada (schemas b2bmatch_* con sus tablas):
--   SELECT schemaname, tablename FROM pg_tables WHERE schemaname LIKE 'b2bmatch_%' ORDER BY 1, 2;
