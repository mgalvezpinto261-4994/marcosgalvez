-- Separa el schema compartido "b2bmatch" en UN SCHEMA POR MICROSERVICIO.
-- Igual lógica que DATABASE/10_split_schemas.sql, pero como migración Flyway
-- para que corra dentro del arranque de "usuarios", ANTES de que Hibernate
-- valide los schemas (ddl-auto: validate).
--
-- Es idempotente (ALTER TABLE IF EXISTS): en bases ya separadas (como la local
-- b2bmatch-postgres) no hace nada y solo queda registrada en flyway_schema_history.
-- Flyway envuelve cada migración en una transacción; el schema "b2bmatch" se
-- conserva con flyway_schema_history y las funciones de pgcrypto.

CREATE SCHEMA IF NOT EXISTS b2bmatch_usuarios;
CREATE SCHEMA IF NOT EXISTS b2bmatch_perfiles;
CREATE SCHEMA IF NOT EXISTS b2bmatch_catalogo;
CREATE SCHEMA IF NOT EXISTS b2bmatch_ofertas;
CREATE SCHEMA IF NOT EXISTS b2bmatch_resenias;
CREATE SCHEMA IF NOT EXISTS b2bmatch_notificaciones;

-- usuarios: app_user, role
ALTER TABLE IF EXISTS b2bmatch.app_user SET SCHEMA b2bmatch_usuarios;
ALTER TABLE IF EXISTS b2bmatch.role SET SCHEMA b2bmatch_usuarios;

-- perfiles: company/customer/professional_profile
ALTER TABLE IF EXISTS b2bmatch.company_profile SET SCHEMA b2bmatch_perfiles;
ALTER TABLE IF EXISTS b2bmatch.customer_profile SET SCHEMA b2bmatch_perfiles;
ALTER TABLE IF EXISTS b2bmatch.professional_profile SET SCHEMA b2bmatch_perfiles;

-- catalogo: category, service, company_service, skill, professional_skill
ALTER TABLE IF EXISTS b2bmatch.category SET SCHEMA b2bmatch_catalogo;
ALTER TABLE IF EXISTS b2bmatch.service SET SCHEMA b2bmatch_catalogo;
ALTER TABLE IF EXISTS b2bmatch.company_service SET SCHEMA b2bmatch_catalogo;
ALTER TABLE IF EXISTS b2bmatch.skill SET SCHEMA b2bmatch_catalogo;
ALTER TABLE IF EXISTS b2bmatch.professional_skill SET SCHEMA b2bmatch_catalogo;

-- ofertas: job_offer, application, quotation
ALTER TABLE IF EXISTS b2bmatch.job_offer SET SCHEMA b2bmatch_ofertas;
ALTER TABLE IF EXISTS b2bmatch.application SET SCHEMA b2bmatch_ofertas;
ALTER TABLE IF EXISTS b2bmatch.quotation SET SCHEMA b2bmatch_ofertas;

-- resenias: review
ALTER TABLE IF EXISTS b2bmatch.review SET SCHEMA b2bmatch_resenias;

-- notificaciones: notification
ALTER TABLE IF EXISTS b2bmatch.notification SET SCHEMA b2bmatch_notificaciones;
