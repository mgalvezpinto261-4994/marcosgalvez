/*
====================================================
 Project : b2bmatch
 File    : 99_seed_demo_data.sql
 Purpose : DUMMY/DEMO data for local integration testing only.
           NOT part of the original 18-script migration set —
           kept separate so it is never mistaken for required
           production seed data. Safe to re-run on a fresh DB
           (guards on tax_id/email uniqueness are handled by
           only inserting when not already present).
====================================================
*/

SET search_path TO b2bmatch, public;

-- 4 demo company users (role COMPANY) + their company profiles + one
-- published service each, so the "Servicios destacados" section of the
-- Landing has real rows to fetch instead of the frontend's mock data.

INSERT INTO app_user (role_id, email, password_hash, status)
SELECT r.id, v.email, '$2a$10$demoDemoDemoDemoDemoDemoDemoDemoDemoDemoDemoDemoDemo', 'ACTIVE'
FROM (VALUES
    ('contacto@andesdesign.cl'),
    ('hola@novacodelabs.io'),
    ('contacto@bravoyrios.cl'),
    ('info@obrasurconstrucciones.cl')
) AS v(email)
JOIN role r ON r.name = 'COMPANY'
WHERE NOT EXISTS (SELECT 1 FROM app_user u WHERE u.email = v.email);

INSERT INTO company_profile (user_id, company_name, tax_id, industry, city, country, company_description)
SELECT u.id, v.company_name, v.tax_id, v.industry, v.city, 'Chile', v.description
FROM (VALUES
    ('contacto@andesdesign.cl', 'Andes Design Studio', '76.111.222-3', 'Diseño gráfico', 'Santiago', 'Empresa demo generada para pruebas de integración.'),
    ('hola@novacodelabs.io', 'NovaCode Labs', '76.222.333-4', 'Desarrollo de software', 'Concepción', 'Empresa demo generada para pruebas de integración.'),
    ('contacto@bravoyrios.cl', 'Consultora Bravo & Ríos', '76.333.444-5', 'Servicios legales', 'Santiago', 'Empresa demo generada para pruebas de integración.'),
    ('info@obrasurconstrucciones.cl', 'ObraSur Construcciones', '76.444.555-6', 'Construcción', 'Valparaíso', 'Empresa demo generada para pruebas de integración.')
) AS v(email, company_name, tax_id, industry, city, description)
JOIN app_user u ON u.email = v.email
WHERE NOT EXISTS (SELECT 1 FROM company_profile cp WHERE cp.tax_id = v.tax_id);

INSERT INTO company_service (company_id, category_id, title, description, price, status)
SELECT cp.id, c.id, v.title, v.description, v.price, 'ACTIVE'
FROM (VALUES
    ('76.111.222-3', 'Graphic Design', 'Identidad de marca completa',
     'Diseño de logo, paleta de colores y manual de marca para tu negocio.', 320000),
    ('76.222.333-4', 'Software Development', 'Desarrollo de plataformas a medida',
     'Sistemas web y móviles a medida, desde el diseño hasta el despliegue.', 1450000),
    ('76.333.444-5', 'Legal Services', 'Asesoría legal para empresas',
     'Constitución de sociedades, contratos comerciales y cumplimiento tributario.', 210000),
    ('76.444.555-6', 'Construction', 'Remodelación de oficinas y locales',
     'Proyectos de remodelación integral para espacios comerciales.', 2800000)
) AS v(tax_id, category_name, title, description, price)
JOIN company_profile cp ON cp.tax_id = v.tax_id
JOIN category c ON c.name = v.category_name
WHERE NOT EXISTS (
    SELECT 1 FROM company_service cs WHERE cs.company_id = cp.id AND cs.title = v.title
);
