# Bitácora del proyecto — B2BMatch (repo `hermanos`)

> Este archivo existe para que cualquier persona (o cualquier asistente de IA nuevo, en cualquier herramienta) pueda retomar el trabajo sin perder contexto. Se actualiza a medida que se avanza. Última actualización: 2026-08-04.

## 1. Qué es el proyecto

**B2BMatch** (el README lo llama "ExpertConnect"): marketplace B2B de servicios profesionales. Conecta `customer`, `professional`, `company` y `admin` alrededor de ofertas de trabajo, cotizaciones, servicios y reseñas. **No** es un sistema de reservas — es "matching" de talento/servicios: profesionales y empresas publican servicios, clientes los contratan.

## 2. Estructura del repo

- `BACKEND/` — 6 microservicios Spring Boot 4 / Java 21 (`usuarios`, `perfiles`, `catalogo`, `ofertas`, `resenias`, `notificaciones`).
- `DATABASE/` — 18 scripts SQL numerados y documentados, más `99_seed_demo_data.sql` (nuevo, ver Iteración 7).
- `FRONTEND/` — React 19 + Vite 8 + React Router 7. **Este es el foco principal del trabajo.**

## 3. Estado del Frontend (antes de la Iteración 1)

Arquitectura de carpetas bien pensada pero **completamente vacía**: 14 páginas (`src/pages/{Admin,Auth,Company,Landing,User}`), 9 componentes, 4 layouts — todos archivos de 0 bytes. Lo único que renderizaba era el scaffold por defecto de Vite (logo, contador, "Get started").

### Hallazgo clave: diseño perdido, recuperado del historial de git

En el commit `825da9b` ("componentes y css") sí se construyó una identidad visual real, pero se subió por error en la raíz del repo (no en `FRONTEND/`) y se borró en la limpieza `0341131`. Se rescató vía `git show 825da9b:<path>`:

- **Paleta** (dark mode por defecto, override `[data-theme="light"]`):
  - `--bg-main: #0A2540` (navy), `--bg-card: #0F3052`, `--bg-navbar: rgba(10,37,64,0.85)`
  - `--text-main: #FFFFFF`, `--text-muted: #94A3B8`, `--text-accent: #63B3ED` (celeste)
  - `--red-glow: #E53E3E` (acento CTA)
- **Tipografía:** Plus Jakarta Sans (400–800), Google Fonts.
- **Estilo:** navbar con `backdrop-filter: blur(16px)` + borde rojo sutil, botones con glow rojo en hover, cards con borde-hover animado (`::before` gradiente).
- Fuente completa rescatada: `variables.css`, `navbar.css`, `buttons.css`, `cards.css`, `Navbar.jsx` del commit `825da9b`. También el logo real (`src/assets/img/logo.png`), rescatado más tarde en la Iteración 5.

## 4. Referencias de diseño aportadas por el usuario

1. **GitHub `nextlevelbuilder/ui-ux-pro-max-skill`** — no es una página de ejemplo, es un *skill/plugin de Claude Code*: motor de reglas de diseño por industria (161 reglas, 84 estilos, 192 paletas). **Instalado** en este proyecto vía `npm install -g ui-ux-pro-max-cli` + `uipro init --ai claude` → archivos en `.claude/skills/`.
   - Consultado para "B2B services marketplace" → recomienda patrón **Marketplace/Directory**: Hero enfocado en búsqueda (la barra de búsqueda es el CTA principal), secciones Hero → Categorías → Listados destacados → Confianza/Seguridad → CTA final. Checklist de calidad: contraste 4.5:1, `cursor-pointer`, transiciones 150–300ms, `prefers-reduced-motion`, breakpoints 375/768/1024/1440.
   - Su paleta sugerida por defecto (navy/dorado) **no se usó** — se conservó la paleta rescatada del punto 3.
2. **Spec de referencia (hero de password-manager, motionsites.ai)** — se usó solo la *mecánica*, no el copy ni assets: Framer Motion con variante `fadeUp` escalonada, navbar con links + 2 botones pill, menú móvil tipo *sheet* deslizante con `AnimatePresence`, headline con iconos inline (Lucide), CTA pill con icono. **No se usa** el video de fondo de su CDN (asset ajeno) — se reemplaza por un fondo propio.

## 5. Decisiones tomadas con el usuario

| Decisión | Elegido |
|---|---|
| Punto de partida visual | Recuperar paleta/diseño del commit `825da9b`, no partir de cero |
| Enfoque de estilos | Tailwind CSS (v4, `@tailwindcss/vite`) — no Bootstrap, no CSS custom puro |
| Librería de animación | Framer Motion |
| Iconos | lucide-react |
| Skill de diseño | Instalar `ui-ux-pro-max` en el proyecto (hecho) |
| Primera página a construir | Landing pública (para "anunciar" la app) |

## 6. Iteración 1 — Tooling base + Navbar + Hero — COMPLETADA

Alcance: tooling base + Navbar + Hero de Landing. Plan detallado guardado en `/Users/rodrigogalvez/.claude/plans/hola-necesito-que-hagas-eager-naur.md`.

### Checklist

- [x] Instalar Tailwind v4, Framer Motion, Lucide React; quitar Bootstrap de `package.json`
- [x] Configurar `vite.config.js` (plugin `@tailwindcss/vite`)
- [x] `src/index.css`: fuente Plus Jakarta Sans + `@import "tailwindcss"` + variables CSS rescatadas (vía `@theme`, dark por defecto, override `[data-theme="light"]`)
- [x] Limpiar boilerplate de Vite (`App.jsx` ahora es shell de `AppRoutes`, `App.css` y assets de ejemplo eliminados, `<title>` actualizado)
- [x] `src/components/Navbar.jsx`: navbar sticky con blur + menú móvil tipo sheet animado con Framer Motion
- [x] `src/pages/Landing/Landing.jsx`: Hero con headline+iconos Lucide inline, fondo gradiente propio, barra de búsqueda como CTA principal + botón "Publicar servicio", animaciones `fadeUp` escalonadas
- [x] Routing mínimo: `AppRoutes.jsx` (`/` → Landing)
- [x] Verificación: `npm run build`/`lint` sin errores; Playwright headless (desktop 1440px y mobile 390px) sin errores de consola

### Cómo verificar rápido en cualquier sesión nueva

```bash
cd FRONTEND && npm install && npm run dev
# abrir http://localhost:5173/
```

## 7. Archivos creados/modificados en la Iteración 1

- `FRONTEND/package.json` — quitó `bootstrap`, agregó `tailwindcss`, `@tailwindcss/vite`, `framer-motion`, `lucide-react`
- `FRONTEND/vite.config.js` — plugin de Tailwind
- `FRONTEND/index.html` — título real
- `FRONTEND/src/index.css` — tokens de diseño + Tailwind
- `FRONTEND/src/App.jsx` — shell que monta `AppRoutes`
- `FRONTEND/src/components/Navbar.jsx` — navbar + menú móvil animado
- `FRONTEND/src/pages/Landing/Landing.jsx` — hero de la landing
- `FRONTEND/src/routes/AppRoutes.jsx` — routing mínimo (`/` → Landing)

## 9. Iteración 2 — Landing completa (Categorías, Listados, Confianza, CTA final) — COMPLETADA

Alcance: terminar la Landing pública siguiendo el patrón **Marketplace/Directory** de la skill `ui-ux-pro-max` (Hero → Categorías → Listados destacados → Confianza/Seguridad → CTA final → Footer). Ejecutada de forma autónoma (autorización general del usuario vía `.claude/settings.json`), sin pasos de aprobación intermedios.

### Qué se construyó

- **`src/data/mockOffers.js`** — 4 servicios de ejemplo (diseño de marca, desarrollo de app, asesoría legal, remodelación) con categoría, precio, ubicación, rating y tags.
- **`src/components/JobCard.jsx`** — card reutilizable para un servicio/oferta: categoría, título, empresa, tags, ubicación, rating, precio; borde-hover animado consistente con el `cards.css` rescatado de `825da9b`.
- **`src/components/Footer.jsx`** — footer con logo, propuesta de valor y 3 columnas de links.
- **`src/pages/Landing/Landing.jsx`** — reescrito completo, añadiendo sobre el Hero:
  - **Categories**: grid de 6 categorías de servicio con icono Lucide, animación `whileInView`.
  - **FeaturedListings**: grid de `JobCard` alimentado por `mockOffers`.
  - **Trust**: 3 propuestas de valor (Perfiles verificados, Cotizaciones directas, Reseñas reales).
  - **FinalCta**: banner de cierre con dos CTAs.

### Verificación realizada

- `npm run build`/`lint` sin errores.
- Playwright: primera pasada con captura `full_page` directa mostró las secciones `whileInView` en blanco — **no es un bug**, el `IntersectionObserver` de Framer Motion solo dispara con scroll real. Segunda pasada con scroll incremental real confirmó que todo renderiza y anima correctamente en desktop (1440px) y mobile (390px).

### Archivos nuevos/modificados

- `FRONTEND/src/data/mockOffers.js`, `src/components/JobCard.jsx`, `src/components/Footer.jsx` (nuevos)
- `FRONTEND/src/pages/Landing/Landing.jsx` (reescrito, ahora completo)

## 11. Iteración 3 — Fondo animado "galáctico" en el Hero — COMPLETADA

El usuario pidió, tras inspeccionar la Landing en su propio Chrome (`npm run dev` + `open -a "Google Chrome"`), un fondo más dinámico/"galáctico" en vez de los blobs estáticos originales — inspirado en el estilo flotante del prompt de referencia de motionsites.ai, pero sin depender de un video externo.

- **`src/components/StarField.jsx`** (nuevo) — campo de estrellas animado en `<canvas>`: ~160 partículas con parpadeo (sinusoidal) y deriva lenta continua. Respeta `prefers-reduced-motion`.
- **`Landing.jsx` → `HeroBackground`**: los dos blobs de gradiente (celeste/rojo) con movimiento orgánico continuo e infinito vía Framer Motion (duraciones distintas de 14s/18s) más parallax sutil ligado al mouse dentro del Hero (`useMotionValue` + `useSpring` + `useTransform`).
- Verificado con Playwright: sin errores de consola, el fondo cambia visualmente entre distintas posiciones del mouse (parallax confirmado), build/lint limpios.

## 12. Iteración 4 — Tokens 3D-glass flotando (inspirado en referencia motionsites) — COMPLETADA

El usuario compartió capturas del hero de referencia (password manager, motionsites.ai) mostrando monedas/discos 3D-glass flotando con vaivén lento alrededor del CTA, y pidió un efecto notoriamente similar.

- **`src/components/FloatingTokens.jsx`** (nuevo en su momento) — 6 paneles circulares "glass" con iconos Lucide del dominio (Briefcase, Code2, Handshake, Wallet, ShieldCheck, Sparkles), en dos tintes (celeste/rojo). Cada uno flota de forma independiente e infinita (duraciones entre 6.5s y 9s, delays distintos).
- Integrado en `Hero` de `Landing.jsx`, capa `z-[5]` entre fondo y texto, `pointer-events-none`.
- **Bug encontrado y corregido**: en mobile (390px) el token "Briefcase" se superponía al subtítulo. Se corrigió marcándolo `hideOnMobile`.
- Verificado con Playwright: capturas en dos instantes confirman flotación real, sin errores de consola, desktop y mobile.

> **Nota:** `FloatingTokens.jsx` fue reemplazado en la Iteración 5 por `GlassField.jsx` — ya no existe como archivo, su lógica evolucionó a un componente global de página completa.

## 13. Iteración 5 — Logo real, campo glass global y auditoría de contenido — COMPLETADA

Ejecutada de forma autónoma (autorización general del usuario), sin pasos de aprobación intermedios. Pedido del usuario: (1) usar el logo real de la marca en vez del badge placeholder "B2", (2) que los paneles glass reaccionen de forma más notoria al mouse y emitan brillo, y que el efecto no se limite al Hero sino que esté en toda la página sin afectar los textos, (3) revisar/corregir el copy y su ubicación por sección — pidiendo explícitamente que actuara con criterio de developer full-stack + marketing + diseño, no solo de código.

### Logo real
- El logo de marca (`B2M` + wordmark "B2BMatch" + tagline "Conecta tu negocio") también se había perdido en el commit `825da9b` (`src/assets/img/logo.png`, 1024×558, PNG con canal alfa). Se rescató con `git show 825da9b:src/assets/img/logo.png`.
- **Problema detectado:** el logo original usa tonos verde oscuro casi negro — invisible sobre nuestro fondo navy. Se generó una variante `logo-light.png` remapeando color por luminancia con Pillow (píxeles oscuros → blanco para el wordmark/tagline, píxeles medios/claros → celeste de marca para el ícono "B2M"), verificada compositando sobre `#0A2540` antes de integrarla. Se usa en `Navbar.jsx` y `Footer.jsx`.

### Campo glass global (page-wide)
- **`src/components/GlassField.jsx`** (nuevo, reemplaza `FloatingTokens.jsx`) — capa `position: fixed` a nivel de toda la página (montada una sola vez en `Landing()`), por lo que el efecto persiste visible en cualquier sección mientras se hace scroll, no solo al inicio.
  - Parallax mucho más notorio: cada token con `depth` propio ligado a la posición global del mouse (`pointermove` en `window` + `useSpring`).
  - Brillo/glow: cada token pulsa su propio `box-shadow` en loop en los tonos celeste/rojo de marca.
  - Spotlight de cursor: halo radial grande, sutil (`opacity 0.14`, blur 90px, `mix-blend-screen`) que sigue al mouse en toda la página.
  - Seguridad de texto: los tokens solo se muestran en pantallas `xl:` (≥1280px), posicionados en los márgenes fuera de la columna de contenido — en mobile/tablet no aparecen.

### Auditoría de copy y estructura (rol full-stack + marketing + diseño)
- **Bug real encontrado:** los links del Navbar ("Empresas", "Talento") apuntaban a anchors inexistentes. "Cómo funciona" apuntaba a la sección Trust, que en realidad habla de confianza/seguridad, no de un proceso paso a paso.
- **Corrección:** Navbar reordenado a 4 links 1:1 con secciones reales: `Servicios` (#servicios) → `Cómo funciona` (#como-funciona, nueva sección) → `Destacados` (#destacados) → `Confianza` (#confianza).
- **Sección nueva `HowItWorks`** ("Cómo funciona"): 3 pasos numerados (Busca o publica → Conecta y cotiza → Contrata con confianza), insertada entre Categorías y Listados destacados.
- Footer: links con sección real de destino apuntan a su anchor; los que corresponden a páginas no construidas se dejaron como placeholder `#` a propósito.
- Verificado con Playwright: clic en cada link del Navbar desplaza correctamente a su sección; build y lint sin errores.

## 14. Iteración 6 — Ajustes de logo y campo glass (feedback visual del usuario) — COMPLETADA

El usuario revisó la Iteración 5 en vivo y pidió: logo más grande, tokens más grandes y mejor repartidos (no en línea recta pegados a la orilla), parallax más notorio, y que roten ("girar").

- **Logo:** de `h-8/h-9` a `h-11 sm:h-14` en Navbar y `h-12` en Footer.
- **`GlassField.jsx`:** posiciones de los 6 tokens redistribuidas con offsets horizontales variados por columna y más separación vertical; tamaños aumentados (hasta `h-28 w-28`); `depth` subido de 45–100 a 80–150; rotación 3D real (`rotateY: 360`, `linear`, loop infinito, `perspective` + `transformStyle: preserve-3d`) independiente del vaivén — efecto "moneda girando".
- Verificado con Playwright: capturas con el mouse en extremos opuestos muestran desplazamientos de cientos de píxeles, capturas en dos instantes muestran tokens "de canto" (confirma rotación 3D), sin errores de consola.

## 15. Iteración 7 — Integración real Frontend ↔ Backend ↔ Base de datos — COMPLETADA

El usuario pidió validar e integrar el Frontend con el Backend/infra existente y la base de datos, comportándome como experto full-stack + infra, con pruebas reales y sin bugs. Como no hay acceso a una base de datos de producción, se usó una **base de datos local dummy en Docker** para las pruebas.

### 1. Base de datos de prueba (Docker)
- Contenedor `b2bmatch-postgres` (`postgres:16-alpine`), puerto **5433** (coincide con el `application.yaml` de los 6 microservicios), DB `b2bmatch`, user/pass `postgres`/`postgres`, volumen nombrado `b2bmatch-pgdata`.
- **Bug de infra encontrado y corregido:** los 18 scripts de `DATABASE/` usan `SET search_path` en el script 01, pero eso es *session-scoped* — si cada `.sql` se ejecuta como un `psql -f` separado, los scripts 02-18 caen en el schema `public` en vez de `b2bmatch`, y **todos los microservicios fallarían al arrancar**. Se corrió todo concatenado (`cat 01_*.sql ... 18_*.sql | psql`) en una sola sesión. Confirmado: las 15 tablas quedaron en el schema `b2bmatch` correctamente.
- **`DATABASE/99_seed_demo_data.sql`** (nuevo, separado de los 18 scripts oficiales): datos dummy idempotentes (`WHERE NOT EXISTS`) — 4 `app_user` (rol COMPANY) + 4 `company_profile` + 4 `company_service`, con nombres **distintos** a los del mock del frontend (Andes Design Studio, NovaCode Labs, Consultora Bravo & Ríos, ObraSur Construcciones) para verificar sin ambigüedad que los datos vienen de la base real.

### 2. Backend — reparación e implementación real
- **Bug reparado:** `usuarios/model/AppUser.java` tenía `private Role role_id;` sin `@ManyToOne`/`@JoinColumn` (bug detectado en el análisis inicial). Se corrigió con el mapeo correcto, se agregaron `@Column` para todos los campos, y se completó `Role.java` (antes clase vacía sin `@Entity`). **Validado arrancando el servicio `usuarios` contra la DB real** (`ddl-auto: validate`): arrancó en 1.5s sin errores.
- **`catalogo`** (antes 100% stubs): se implementaron `Category` y `CompanyService` como entidades JPA reales, sus repositorios, y dos endpoints REST nuevos:
  - `GET /api/categories` — lista las 17 categorías reales.
  - `GET /api/company-services` — listado de servicios activos, con un projection interface (`CompanyServiceListingView`) que hace un join nativo contra `category` y `company_profile` (simplificación consciente en vez de llamar al microservicio `perfiles` vía HTTP — documentado como deuda técnica).
  - CORS habilitado explícitamente para `http://localhost:5173`.
  - **Validado arrancando el servicio contra la DB real** y probando ambos endpoints con `curl` — devuelven JSON real con los datos sembrados, joins incluidos.
  - El resto de `catalogo` (`Skill`, `ProfessionalSkill`, `ProfessionalService`) y los otros 4 microservicios (`perfiles`, `ofertas`, `resenias`, `notificaciones`) **siguen siendo stubs sin implementar**.

### 3. Frontend — consumo real con resiliencia
- **`FRONTEND/.env` / `.env.example`** — `VITE_CATALOGO_API_URL=http://localhost:8083`.
- **`FRONTEND/src/lib/api.js`** — `fetchCompanyServices()`: fetch con timeout de 4s (`AbortController`), mapea la respuesta al shape que ya usaba `JobCard` (precio formateado como CLP con `Intl.NumberFormat`, ciudad de la empresa como ubicación).
- **`Landing.jsx` → `FeaturedListings`**: hace fetch real al montar; si tiene éxito, reemplaza `mockOffers` por los datos reales (`data-source="api"` en el DOM, verificable en tests); si falla, **cae de vuelta a `mockOffers` automáticamente** (`data-source="mock"`) con un `console.warn`, sin romper la UI.
- **`JobCard.jsx`**: ajustado para manejar `rating` ausente (servicios reales aún sin reseñas) mostrando una insignia "Nuevo" en vez de inventar una calificación falsa.

### 4. Pruebas end-to-end realizadas
- Con el stack completo arriba: confirmado con Playwright que `#destacados` tiene `data-source="api"` y el texto contiene "Andes Design Studio" y "NovaCode Labs" — prueba inequívoca de datos reales.
- **Prueba de resiliencia:** se detuvo el backend (`catalogo`) a propósito y se recargó la página — `data-source` cambió a `"mock"`, se mostró "Estudio Norte" (mock), sin crashear y sin error visible al usuario.
- Backend reiniciado al final para dejar la demo funcionando en vivo.

### Cómo levantar el stack completo (para cualquier sesión nueva)

```bash
# 1. Base de datos dummy
docker run -d --name b2bmatch-postgres \
  -e POSTGRES_DB=b2bmatch -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres \
  -p 5433:5432 -v b2bmatch-pgdata:/var/lib/postgresql/data postgres:16-alpine

# 2. Schema + seed oficial + seed demo (en una sola sesión de psql)
cd DATABASE
cat 01_*.sql 02_*.sql 03_*.sql 04_*.sql 05_*.sql 06_*.sql 07_*.sql 08_*.sql 09_*.sql \
    10_*.sql 11_*.sql 12_*.sql 13_*.sql 14_*.sql 15_*.sql 16_*.sql 17_*.sql 18_*.sql 99_*.sql \
  | docker exec -i b2bmatch-postgres psql -U postgres -d b2bmatch -v ON_ERROR_STOP=1

# 3. Backend (catalogo)
cd BACKEND/catalogo && mvn spring-boot:run   # puerto 8083

# 4. Frontend
cd FRONTEND && npm install && npm run dev    # puerto 5173, ya trae VITE_CATALOGO_API_URL en .env
```

**Nota:** el contenedor Docker y el proceso de `catalogo` quedaron corriendo en la sesión de la Iteración 7 para que la demo se viera en vivo. Si se reinicia la máquina o se cierra Docker, hay que repetir los pasos 1-3 (el volumen `b2bmatch-pgdata` conserva los datos si el contenedor solo se detiene, no si se borra el volumen).

## 16. Iteración 8 — Login/Registro real con JWT (microservicio `usuarios`) — COMPLETADA

Ejecutada de forma autónoma (autorización general, sin preguntas de sí/no), siguiendo la recomendación por defecto dejada en el handoff de la sesión anterior (sección 18 más abajo, antes sección 16). Alcance: Login/Registro real (BCrypt + JWT) contra el microservicio `usuarios`, con la sesión persistida en el frontend y reflejada en el Navbar.

### Backend (`usuarios`)

- **`pom.xml`**: agregadas `jjwt-api`/`jjwt-impl`/`jjwt-jackson` 0.12.6 (la app ya traía `spring-boot-starter-security`, que aporta `BCryptPasswordEncoder`).
- **Modelos nuevos**: `CustomerProfile`, `ProfessionalProfile`, `CompanyProfile` (uno por rol registrable), mapeando 1:1 las tablas `customer_profile`/`professional_profile`/`company_profile` ya existentes en `DATABASE/04-06_*.sql`. `AppUser`/`Role` ya venían reparados de la Iteración 7.
- **Repositorios**: `AppUserRepository` (`findByEmail`, `existsByEmail`), `RoleRepository` (`findByName`), y uno por perfil con `findByUserId` (el id de la fila de perfil NO es el mismo que `user_id` — son entidades separadas con su propio PK, cuidado si se reutiliza este patrón).
- **`security/JwtService.java`**: firma/parsea tokens HS384 con `jjwt`, claims `userId` + `role`, expiración configurable.
- **`security/SecurityConfig.java`**: `BCryptPasswordEncoder` bean, `SecurityFilterChain` stateless (sin sesión HTTP), CSRF deshabilitado (API sin cookies), CORS explícito para `http://localhost:5173`, `/api/auth/**` público. **Decisión consciente de alcance:** el resto de rutas también quedan `permitAll()` por ahora — no hay todavía un endpoint protegido (`/api/auth/me` o similar) que exija el JWT en el header, porque no hay página de perfil/dashboard que lo consuma aún. Cuando se construyan las páginas por rol (próximo hito lógico), ahí sí hace falta un filtro que valide el `Authorization: Bearer <token>` y proteja rutas reales — hoy sería seguridad de fachada sin nada que proteger.
- **`application.yaml`**: agregadas `jwt.secret` y `jwt.expiration-ms` (con defaults de desarrollo vía `${JWT_SECRET:...}`/`${JWT_EXPIRATION_MS:...}`, sobreescribibles por variable de entorno).
- **`dto/`**: `RegisterRequest` (con `@Email`/`@NotBlank`/`@Size(min=8)`/`@Pattern` de rol), `LoginRequest`, `AuthResponse` (token + userId + email + role + displayName).
- **`exception/`**: `AuthException` (con `HttpStatus` propio) + `GlobalExceptionHandler` (`@RestControllerAdvice`) para mapear validación y errores de negocio a JSON limpio en vez de stack traces.
- **`service/AppUserService.java`**: `register()` valida email único, valida campos obligatorios según rol (`companyName`+`taxId` para COMPANY, `firstName`+`lastName` para CUSTOMER/PROFESSIONAL), valida `taxId` único para empresas, hashea con BCrypt, crea `AppUser` + su perfil de rol en una transacción, y devuelve JWT. `login()` valida credenciales y estado `ACTIVE`.
- **`controller/AuthController.java`**: `POST /api/auth/register`, `POST /api/auth/login`, CORS igual que `catalogo`.
- **Validado con el servicio arrancado contra la DB real** (`ddl-auto: validate`, arrancó sin errores) y `curl`: registro CUSTOMER (200), login correcto (200), login con password incorrecta (401), registro COMPANY (200), registro con email duplicado (409), registro con password <8 caracteres (400 con mensaje de validación por campo). Confirmado en la base real (`SELECT` sobre `app_user`) que los usuarios creados por los tests quedaron persistidos con su rol correcto.

### Frontend

- **`.env`/`.env.example`**: agregado `VITE_USUARIOS_API_URL=http://localhost:8081`.
- **`src/lib/auth.js`** (nuevo): `register()`/`login()` (POST con timeout de 6s, igual patrón que `lib/api.js` de la Iteración 7), `logout()`, `getSession()`. La sesión (`token`, `userId`, `email`, `role`, `displayName`) se guarda en `localStorage` bajo la key `b2bmatch.session`; cada cambio dispara un evento custom `b2bmatch-session-change` en `window` para que cualquier componente reaccione sin necesidad de un Context/Provider global.
- **`src/lib/useSession.js`** (nuevo): hook que lee la sesión y se suscribe a `b2bmatch-session-change` (mismo tab) y `storage` (otras tabs).
- **`src/pages/Auth/Login.jsx`** y **`src/pages/Auth/Register.jsx`** (antes stubs vacíos, ahora completos): formularios con la identidad visual existente (`--color-*` tokens, `Plus Jakarta Sans`, logo real, animación `fadeUp` de Framer Motion). `Register.jsx` tiene selector de rol (Cliente/Profesional/Empresa) con campos condicionales (nombre/apellido vs. razón social/RUT/rubro) y usa el mismo `RegisterRequest` shape que espera el backend. Ambos muestran errores de la API (incluyendo validación por campo) sin recargar la página.
- **`src/routes/AppRoutes.jsx`**: rutas nuevas `/login` y `/registro`.
- **`src/components/Navbar.jsx`**: los botones "Publicar un servicio"/"Iniciar sesión" (antes decorativos, sin `href` real) ahora son `Link` a `/registro`/`/login`. Cuando hay sesión activa (`useSession`), se reemplazan por un saludo ("Hola, {primer nombre}") + botón "Cerrar sesión" — tanto en desktop como en el menú móvil.

### Verificación end-to-end (Playwright)

Se corrió un script Playwright (`chromium`, headless) contra el stack completo (Postgres Docker + `usuarios` en 8081 + `catalogo` en 8083 + Vite en 5173) cubriendo: cargar Landing → clic en "Publicar un servicio" → completar registro CUSTOMER → sesión visible en Navbar → verificar `localStorage` → cerrar sesión → login con la cuenta recién creada → login con password incorrecta (error visible) → registro con email duplicado (error visible) → registro de EMPRESA con selector de rol. **Los 10 pasos pasaron**; se confirmó además contra la base de datos real (`SELECT` en `app_user`) que los usuarios creados durante el test quedaron persistidos con su rol correcto. `npm run lint` y `npm run build` del frontend sin errores.

### Nota de infraestructura

Se encontró un servidor `vite dev` **obsoleto de una sesión previa** ocupando el puerto 5173 (el backend tiene el CORS hardcodeado a ese puerto exacto). Se cerró (`kill`) junto con otro proceso residual en el 5174, y se relanzó `npm run dev` limpio en 5173. Si en una sesión futura el frontend no arranca en 5173, revisar `lsof -i :5173` antes de asumir que hay que cambiar el CORS.

### Cómo probar rápido

```bash
# Backend usuarios (además del stack ya documentado en la sección 15)
cd BACKEND/usuarios && mvn spring-boot:run   # puerto 8081

# Frontend (si no está corriendo)
cd FRONTEND && npm run dev                  # puerto 5173 — importante que sea justo este puerto (CORS)
# abrir http://localhost:5173/registro o /login
```

## 17. Iteración 9 — Hardening de seguridad e infraestructura (JWT, Flyway, Docker, CI) — COMPLETADA

El usuario preguntó qué faltaba para un "funcionamiento profesional" (más allá de features). Se respondió con una auditoría (secreto JWT hardcodeado, sin rate limiting, sin `docker-compose`, migraciones manuales sin versionar, sin health checks, sin tests, sin CI) y el usuario autorizó atacar todo lo posible sin más aprobaciones. Alcance: seguridad de la autenticación + reproducibilidad de infraestructura + calidad de código, no features nuevas de producto.

### JWT secret

- **`usuarios/application.yaml`**: se quitó el default hardcodeado (`b2bmatch-dev-secret-key-...`) que estaba comiteado en el repo desde la Iteración 8 — cualquiera con acceso al código podía falsificar tokens válidos. Ahora `jwt.secret: ${JWT_SECRET}` sin default: si la variable no está seteada, el arranque falla rápido en vez de firmar con un secreto público.
- **`.env.example`** (raíz, nuevo) documenta las variables requeridas; **`.env`** (raíz, en `.gitignore`, nunca comiteado) tiene un secreto real generado con `openssl rand -base64 48` para uso local de `docker-compose`.
- **`.gitignore`** (raíz, nuevo — antes el repo no tenía uno a nivel raíz, aunque cada subproyecto sí).

### Migraciones versionadas con Flyway (reemplaza el proceso manual `cat *.sql | psql`)

- Los 18 scripts oficiales de `DATABASE/` se copiaron (sin modificar contenido) a `BACKEND/usuarios/src/main/resources/db/migration/` con nomenclatura Flyway (`V1__create_database.sql` … `V18__seed_data.sql`). `99_seed_demo_data.sql` **deliberadamente no** se migró a Flyway — sigue siendo data dummy separada, no parte del esquema oficial.
- **Hallazgo importante:** Spring Boot 4.1.0 (la versión usada en este proyecto) **todavía no trae auto-configuración de Flyway** — no existe ningún módulo `spring-boot-*flyway*` en el classpath resuelto, así que un bloque `spring.flyway:` en el yaml no hace nada silenciosamente. Se resolvió invocando la API de Flyway directamente en `UsuariosApplication.main()` (método `runMigrations()`, package-private para que los tests también puedan invocarlo) **antes** de `SpringApplication.run()`, garantizando que corra antes de que Hibernate valide el esquema.
- `baselineOnMigrate(true)` + `baselineVersion` parametrizable vía `FLYWAY_BASELINE_VERSION` (default `"0"`, asume base vacía): permite apuntar la misma app a una base ya migrada a mano (como la de la Iteración 7) seteando `FLYWAY_BASELINE_VERSION=18` para que Flyway solo registre el historial sin reintentar crear tablas que ya existen.
- **Validado con un Postgres 16 completamente vacío**: Flyway aplicó las 18 migraciones en orden y Hibernate validó el esquema sin errores (antes fallaba con "missing table [app_user]" hasta corregir el punto anterior).
- `catalogo` no tiene Flyway propio (sigue con `ddl-auto: validate`) — depende de que `usuarios` haya migrado el esquema compartido primero (ver orden de arranque en `docker-compose.yml` y en el job de CI).

### `docker-compose.yml` (raíz, nuevo)

- Servicios: `db` (Postgres 16, volumen propio `b2bmatch-compose-pgdata`, puerto host `5434` para no chocar con el Postgres manual de la Iteración 7 que sigue en `5433`), `usuarios` (build desde `BACKEND/usuarios/Dockerfile`, puerto `8081`), `catalogo` (build desde `BACKEND/catalogo/Dockerfile`, puerto `8083`).
- `Dockerfile` multi-stage (maven:3.9-eclipse-temurin-21 → eclipse-temurin:21-jre-alpine) en `usuarios/` y `catalogo/`.
- `catalogo` tiene `depends_on: usuarios: condition: service_healthy` (no solo `db`) — necesita esperar a que `usuarios` termine de migrar el schema completo con Flyway antes de arrancar, si no su `ddl-auto: validate` falla.
- Health checks reales vía Spring Boot Actuator (`/actuator/health`) para ambos servicios Java, `pg_isready` para Postgres.
- **Los otros 4 microservicios (`perfiles`, `ofertas`, `resenias`, `notificaciones`) quedaron fuera a propósito** — siguen siendo stubs vacíos (confirmado auditándolos: compilan pero no tienen ninguna lógica), agregarlos al compose no aportaría nada hasta que se implementen.
- **Validado de punta a punta**: `docker compose build` + `docker compose up -d` → los 3 contenedores llegan a `healthy`; se registró un usuario real y se consultaron categorías reales contra el stack 100% dockerizado; se corrió de nuevo el script Playwright de la Iteración 8 contra este stack y pasó igual.
- Nota: la base del `docker-compose` es nueva (sin los datos demo de `99_seed_demo_data.sql`), así que `/api/company-services` devuelve `[]` y el frontend cae a mock — comportamiento esperado y correcto (confirma que el fallback de resiliencia de la Iteración 7 sigue funcionando), no un bug.

### Rate limiting en login

- **`security/LoginRateLimiter.java`** (nuevo): limitador en memoria por IP, 10 intentos/minuto con ventana deslizante (`ConcurrentHashMap` + `Deque<Instant>`). Documentado como limitación consciente: si el servicio escala a múltiples instancias, cada una tendría su propio contador — para eso hace falta un store compartido (Redis). `AuthController.login()` devuelve 429 si se excede.

### Actuator (health checks)

- `spring-boot-starter-actuator` agregado a `usuarios` y `catalogo`, exponiendo `/actuator/health` (usado por Docker healthchecks y, a futuro, por cualquier orquestador). En `usuarios` se agregó `/actuator/**` a la lista `permitAll()` de `SecurityConfig`.

### Tests automatizados (antes: cero)

- **`AppUserServiceTest`** (nuevo, Mockito puro, sin DB): 5 tests — registro rechaza email duplicado, registro de empresa exige `companyName`/`taxId`, registro de cliente exitoso devuelve JWT y `displayName` correctos, login rechaza password incorrecta, login rechaza email inexistente.
- **`LoginRateLimiterTest`** (nuevo): 2 tests — bloquea al superar el límite, y trackea distintas keys (IPs) de forma independiente.
- **`UsuariosApplicationTests`** (existente, antes vacío de facto): ahora corre `UsuariosApplication.runMigrations()` en un `@BeforeAll` antes de que `@SpringBootTest` levante el contexto — si no, el `contextLoads` fallaría porque Flyway solo se dispara desde `main()`, no desde el bootstrap de test de Spring.
- **Validado**: los 8 tests pasan contra un Postgres real (requisito de este test suite: no usa H2 ni Testcontainers, necesita `SPRING_DATASOURCE_URL`/`DB_USERNAME`/`DB_PASSWORD`/`JWT_SECRET` apuntando a un Postgres real — ver el job de CI para el patrón exacto).

### CI (GitHub Actions, nuevo)

- **`.github/workflows/ci.yml`**: job `frontend` (`npm ci` + `lint` + `build`) y job `backend` con un servicio Postgres 16 efímero — corre los tests de `usuarios` primero (dispara Flyway y deja el esquema migrado) y luego los de `catalogo` reutilizando esa misma base ya migrada. Usa un `JWT_SECRET` dummy fijo solo para CI (≥256 bits, requerido por HS384), no vinculado a ningún ambiente real.
- **Validado simulando la secuencia exacta localmente** (Postgres efímero nuevo + `mvn test` en `usuarios` luego `catalogo`, con el `mvn` del sistema — el wrapper `./mvnw` falló en este sandbox local por una restricción de proceso/red específica del entorno de esta sesión, no del workflow; los runners de GitHub Actions no tienen esa restricción).

### Nota sobre el Postgres manual de la Iteración 7

El contenedor `b2bmatch-postgres` (puerto `5433`, levantado a mano en la Iteración 7) sigue existiendo con sus datos, pero **ya no está en uso** — los procesos manuales de `usuarios`/`catalogo` que corrían contra él se detuvieron para liberar los puertos 8081/8083 y probar el `docker-compose` nuevo. El stack "en vivo" ahora es el de `docker-compose` (Postgres en `5434`, contenedor `hermanos-db-1`). Si se quiere volver a usar la base vieja con sus datos demo ya sembrados, hay que detener los contenedores de compose primero (mismo puerto 8081/8083) y levantar los procesos manuales como en la Iteración 7 documentaba.

## 18. Iteración 10 — Microservicio `ofertas` real: publicar/postular a trabajos — COMPLETADA

El usuario pidió, tras entender que "que el negocio funcione completo" no requiere ninguna cuenta ni credencial externa, avanzar sin más aprobaciones intermedias. Se implementó `ofertas` (antes 100% stubs) con el flujo de negocio más valioso: una empresa publica una oferta de trabajo, un profesional la ve y postula, la empresa ve las postulaciones recibidas. **`Quotation` (cotizaciones sobre `service`) quedó deliberadamente fuera de alcance** — esa tabla depende del microservicio `ProfessionalService` dentro de `catalogo`, que sigue siendo stub; implementar cotizaciones sin eso sería probar un flujo que el frontend no podría completar de punta a punta.

### Backend (`ofertas`)

- **Modelos**: `JobOffer` (mapea `job_offer`) y `JobApplication` (mapea `application`), reemplazando las clases vacías del scaffold. `Quotation.java` sigue vacío a propósito.
- **Lecturas de solo lectura entre microservicios** (`model/external/`): `CompanyProfileRef` y `ProfessionalProfileRef` mapean `company_profile`/`professional_profile` (tablas dueñas de `usuarios`) solo para resolver `app_user.id` (viene en el JWT) → `company_profile.id`/`professional_profile.id` (que es lo que las FK de `job_offer`/`application` realmente usan). Mismo patrón de simplificación consciente que `catalogo` ya usaba (documentado ahí desde la Iteración 7).
- **Primer filtro JWT real del proyecto** (`security/JwtAuthFilter.java` + `JwtAuthentication.java`): valida el token emitido por `usuarios` (mismo `JWT_SECRET` compartido), puebla `SecurityContext` con `userId` + rol como `GrantedAuthority`. `SecurityConfig` con `@EnableMethodSecurity`: `GET /api/job-offers/**` público, todo lo demás requiere autenticación; `@PreAuthorize("hasRole('COMPANY')")` / `hasRole('PROFESSIONAL')` en los endpoints que corresponden.
  - **Bug encontrado y corregido en el camino**: `requestMatchers("GET", "/api/job-offers/**")` fallaba en runtime ("pattern must start with a /") porque `"GET"` como `String` cae en el overload de solo-patrones, no en el de `(HttpMethod, String...)` — se corrigió usando `HttpMethod.GET` explícito.
- **Endpoints**: `GET /api/job-offers` (público, activas), `GET /api/job-offers/{id}`, `GET /api/job-offers/mine` (COMPANY), `POST /api/job-offers` (COMPANY), `POST /api/job-offers/{id}/applications` (PROFESSIONAL), `GET /api/job-offers/{id}/applications` (COMPANY dueña de la oferta), `GET /api/applications/mine` (PROFESSIONAL).
- **Reglas de negocio validadas**: no se puede postular dos veces a la misma oferta (409), no se puede postular a una oferta inactiva (409), una empresa no puede ver postulaciones de una oferta que no es suya (403), un perfil sin `company_profile`/`professional_profile` no puede crear ofertas/postular (403).
- Actuator + Dockerfile multi-stage, mismo patrón que `usuarios`/`catalogo`.
- **Tests**: `JobOfferServiceTest` (4) y `JobApplicationServiceTest` (4) con Mockito, sin DB. `OfertasApplicationTests.contextLoads` (1) valida el esquema contra Postgres real (depende de que `usuarios` ya haya migrado — mismo patrón que `catalogo`). Los 9 pasan.
- Agregado a `docker-compose.yml` (`depends_on: usuarios: condition: service_healthy`, mismo motivo que `catalogo`) y al job `backend` de CI.
- **Validado con curl contra la base real**: oferta creada por empresa → visible públicamente sin token → postulación de profesional → empresa ve la postulación con nombre y propuesta → casos de error (postular duplicado 409, ver oferta ajena 403, crear oferta sin token 403, profesional intentando crear oferta 403) todos correctos.

### Frontend

- **`src/lib/ofertas.js`** (nuevo): wrapper de fetch con `Authorization: Bearer` automático desde la sesión guardada, mismo patrón de timeout que `lib/api.js`/`lib/auth.js`.
- **`src/lib/api.js`**: agregado `fetchCategories()` (ya existía el endpoint en `catalogo`, faltaba consumirlo).
- **Páginas reales** (antes 4 archivos vacíos del scaffold):
  - `pages/User/JobOffers.jsx` (`/ofertas`, público): lista ofertas activas; si el usuario logueado es `PROFESSIONAL` muestra botón "Postular" con formulario inline (propuesta + precio esperado opcional); si es `COMPANY` muestra un CTA a publicar; si no hay sesión, invita a iniciar sesión.
  - `pages/Company/CreateOffer.jsx` (`/empresa/nueva-oferta`, solo `COMPANY`): formulario con categorías reales traídas de `catalogo`, redirige a `/ofertas` al publicar.
  - `pages/Company/CompanyOffers.jsx` (`/empresa/mis-ofertas`, solo `COMPANY`): lista las ofertas propias con conteo de postulaciones, expandible para ver el detalle de cada postulante.
  - `pages/User/Applications.jsx` (`/mis-postulaciones`, solo `PROFESSIONAL`): lista las postulaciones propias con su estado.
  - Las cuatro páginas redirigen con `<Navigate>` si el rol no corresponde o no hay sesión — primera vez que el frontend tiene rutas con guardas por rol (antes ninguna ruta las tenía).
- **`Navbar.jsx`**: nuevo link "Ofertas de trabajo" (ahora mixto entre anchors de la Landing y una ruta real, resuelto con un componente `NavLink` que decide `<Link>` vs `<a>` según `isRoute`); usuarios logueados ven un atajo a su panel ("Mis ofertas" o "Mis postulaciones" según rol) junto al saludo.
- Build y lint sin errores.

### Verificación end-to-end (Playwright, 2 páginas de browser en paralelo)

Empresa se registra → publica una oferta con categoría real → profesional (en otra pestaña) se registra → ve la oferta en `/ofertas` → postula con una propuesta → la ve reflejada en `/mis-postulaciones` → la empresa la ve en `/empresa/mis-ofertas` con nombre y propuesta del postulante. **Los 6 pasos pasaron sin errores de consola**, contra el stack 100% dockerizado (`docker-compose`).

## 19. Iteración 11 — Perfiles editables, servicios de profesionales, cotizaciones y reseñas — COMPLETADA

El usuario pidió continuar con todo lo que quedaba pendiente sin necesitar más aprobaciones ni cuentas/servicios externos. Se completó el ciclo de negocio entero que quedaba abierto desde el handoff anterior: perfiles editables, publicar servicios de profesionales (y de empresas), cotizar esos servicios, aceptarlos/rechazarlos, y dejar una reseña real tras un trabajo aceptado. Con esto los 4 microservicios que faltaban por implementar (`perfiles`) o completar (`catalogo`, `ofertas`, `resenias`) quedan funcionales — solo `notificaciones` sigue siendo stub.

### `perfiles` (antes 100% stub) — implementado completo

- `CompanyProfile`, `ProfessionalProfile`, `CustomerProfile`: entidades JPA reales mapeando las tablas ya creadas por Flyway en la Iteración 9 (la fila la crea `usuarios` al registrarse; `perfiles` solo lee/actualiza).
- Primer uso del patrón JWT (`JwtAuthFilter`/`JwtAuthentication`/`SecurityConfig`, mismo código que `ofertas` de la Iteración 10) fuera de `ofertas`.
- Endpoints: `GET/PUT /api/company-profiles/me` (COMPANY), `GET /api/company-profiles/{id}` (público), mismo patrón para `professional-profiles` y `customer-profiles` (sin GET público para el perfil de cliente, por privacidad).
- `taxId` de la empresa es de solo lectura desde el frontend (es la identidad legal, no debería cambiar por error de un formulario).
- Validado con curl: ver/editar perfil propio, verificación de que otro rol no puede editar el perfil que no le corresponde (403), edición sin token (403).
- Agregado a `docker-compose.yml` (puerto 8082) y al job `backend` de CI.

### `catalogo` → `ProfessionalService` (servicios de profesionales) + POST para ambos tipos de servicio

- `ProfessionalService` (mapea la tabla `service`) implementada igual que `CompanyService` ya existente: entidad, `ProfessionalServiceListingView` (join nativo con `category` + `professional_profile`), repositorio, servicio, controlador.
- **`catalogo` no tenía seguridad de ningún tipo hasta ahora** (todo público) — se le agregó el mismo filtro JWT que `ofertas`/`perfiles`, con `GET /api/**` público y el resto autenticado.
- **Aprovechando el cambio, se agregó también `POST /api/company-services`** (antes solo existía el `GET` de la Iteración 7, alimentado únicamente por el seed demo) — ahora una empresa puede publicar sus propios servicios, no solo verlos.
- Ambos POST validan que el usuario autenticado tenga el perfil de rol correspondiente (mismo patrón `*ProfileRef` de solo lectura hacia las tablas de `usuarios`/`perfiles`).
- Validado con curl: profesional publica servicio → aparece en el listado público → una empresa no puede publicar como profesional (403) → empresa publica su propio `company-service`.

### `ofertas` → `Quotation` (cotizaciones de clientes sobre servicios de profesionales)

- Era la pieza que había quedado fuera de la Iteración 10 porque dependía de que `ProfessionalService` existiera en `catalogo` — ya no.
- `Quotation` (mapea la tabla `quotation`) + refs de solo lectura nuevas: `CustomerProfileRef` y `ServiceRef` (esta última lee la tabla `service`, dueña de `catalogo`, para saber qué profesional es dueño de qué servicio).
- **Nota sobre el vocabulario de estados**: el CHECK constraint de `quotation.status` en la base es `ACTIVE|PENDING|SUSPENDED|INACTIVE|DELETED` (el mismo que `job_offer`/`company_service`, no se diseñó pensando en un flujo de cotización). Se reutiliza así: `PENDING` al crear → el profesional la mueve a `ACTIVE` (aceptada) o `INACTIVE` (rechazada). Documentado en el código porque no es autoexplicativo.
- Endpoints: `POST /api/services/{id}/quotations` (CUSTOMER), `GET /api/services/{id}/quotations` (PROFESSIONAL, dueño del servicio), `GET /api/quotations/mine` (CUSTOMER), `PUT /api/quotations/{id}/status` (PROFESSIONAL, dueño).
- Validado con curl: cliente cotiza → profesional ve y acepta → cliente ve el cambio de estado → otro profesional sin ese servicio no puede ver la cotización (403).
- 4 tests unitarios nuevos (Mockito), los 13 de `ofertas` en total pasan.

### `resenias` (antes 100% stub) — implementado completo

- `Review` (mapea la tabla `review`: cliente reseña a un profesional, rating 1-5 + comentario).
- **Regla de negocio clave**: un cliente solo puede reseñar a un profesional con el que haya tenido al menos una cotización aceptada (`status = 'ACTIVE'`). Se valida con una consulta nativa que hace `JOIN` entre `quotation` (dueña: `ofertas`) y `service` (dueña: `catalogo`) — tercer ejemplo del patrón de lectura cross-servicio sobre el esquema compartido, esta vez con un join de dos tablas ajenas en lugar de una sola.
- Un cliente no puede reseñar dos veces al mismo profesional (409).
- Endpoints: `GET /api/professionals/{id}/reviews` (público), `POST /api/professionals/{id}/reviews` (CUSTOMER).
- Validado con curl: reseña válida (200) → reseña duplicada (409) → cliente sin cotización aceptada intenta reseñar (403).
- Agregado a `docker-compose.yml` (puerto 8085, depende de `usuarios` para el esquema, no de `ofertas`/`catalogo` como servicios corriendo — la consulta de elegibilidad lee las tablas directo de Postgres) y al CI.

### Frontend — 7 páginas nuevas + 2 libs nuevas

- **`lib/perfiles.js`** (nuevo): fetch autenticado a los endpoints `/me` de los 3 tipos de perfil.
- **`lib/resenias.js`** (nuevo): fetch de reseñas por profesional + creación.
- **`lib/api.js`** y **`lib/ofertas.js`** ampliados con las funciones de servicios de profesionales/empresa y de cotizaciones respectivamente.
- **`pages/Company/CompanyProfile.jsx`** (`/empresa/mi-perfil`): editar perfil de empresa, `taxId` deshabilitado.
- **`pages/User/UserProfile.jsx`** (`/mi-perfil`): un solo componente que renderiza campos distintos según el rol sea `PROFESSIONAL` o `CUSTOMER` (biografía/tarifa/portafolio vs. dirección).
- **`pages/User/ProfessionalServices.jsx`** (`/servicios-profesionales`, público): listado + cotizar inline (solo `CUSTOMER`).
- **`pages/User/CreateService.jsx`** (`/profesional/publicar-servicio`, solo `PROFESSIONAL`).
- **`pages/User/MyServices.jsx`** (`/profesional/mis-servicios`, solo `PROFESSIONAL`): servicios propios expandibles, ver cotizaciones recibidas, aceptar/rechazar inline.
- **`pages/User/MyQuotations.jsx`** (`/mis-cotizaciones`, solo `CUSTOMER`): cotizaciones propias; si el estado es "Aceptada" aparece un botón "Dejar reseña" con selector de estrellas.
- **`Navbar.jsx`**: reemplacé el link único "dashboard" por una lista `dashboardLinksFor(session)` (hasta 2 links por rol: dashboard principal + "Mi perfil"); agregado "Servicios profesionales" a la navegación pública.
- Todas las páginas nuevas usan `<Navigate>` para redirigir si el rol no corresponde — mismo patrón de guardas por rol introducido en la Iteración 10.

### Verificación end-to-end (Playwright, 3 escenarios con múltiples pestañas)

1. Empresa publica oferta → profesional postula → empresa ve la postulación (repetido de la Iteración 10, sigue pasando).
2. Profesional edita su perfil → publica un servicio → cliente lo cotiza → cliente lo ve en "Mis cotizaciones" → profesional lo ve y acepta en "Mis servicios" (6 pasos, sin errores de consola).
3. Profesional publica servicio → cliente cotiza → profesional acepta → cliente deja una reseña con 5 estrellas (4 pasos, sin errores de consola).

Todo contra el stack 100% dockerizado (ahora 6 contenedores: `db`, `usuarios`, `catalogo`, `ofertas`, `perfiles`, `resenias`, todos `healthy`).

## 20. Iteración 12 — Cierre de flujos pendientes, rol Admin y `notificaciones` — COMPLETADA

El usuario preguntó cuánto faltaba para el 100% (sin contar email/recuperar contraseña) y pidió avanzar con todo. Se cerraron los 3 huecos identificados: flujos de negocio a medias (postulaciones/ofertas sin aceptar/editar/cerrar), el rol ADMIN inalcanzable (sin forma de crear esa cuenta ni panel), y el microservicio `notificaciones` (último stub). Con esto los 6 microservicios de negocio están implementados y el ciclo completo (publicar → postular/cotizar → aceptar/rechazar → reseñar → notificar) funciona de punta a punta.

### `ofertas` — cerrar los flujos que quedaban a medias

- **`JobApplicationService.updateStatus()`** (nuevo): la empresa ahora puede aceptar/rechazar cada postulación (`PUT /api/job-offers/{id}/applications/{appId}/status`, valida que la postulación pertenezca a esa oferta) — antes solo existía `findForOffer` (ver, no decidir), inconsistente con `Quotation` que sí tenía este flujo desde la Iteración 11.
- **`JobOfferService.update()`/`close()`** (nuevo): la empresa puede editar los datos de una oferta o cerrarla (`status → INACTIVE`, ya no aparece en el listado público de activas) — antes una oferta publicada quedaba fija para siempre.
- 4 tests nuevos (2 por cada método), los 17 de `ofertas` pasan.

### Rol ADMIN — de inexistente a operativo

- **Problema real detectado**: el rol `ADMIN` existe en la tabla `role` desde el seed oficial, pero no había ninguna forma de crear esa cuenta — el registro público en `usuarios` solo acepta `CUSTOMER|PROFESSIONAL|COMPANY` (a propósito, nadie debería poder autoasignarse admin) y no existía ningún otro mecanismo.
- **`POST /api/auth/register-admin`** (nuevo, `usuarios`): crea la cuenta admin (sin perfil asociado — `ADMIN` no tiene tabla de perfil propia) solo si el caller conoce `ADMIN_BOOTSTRAP_KEY` (header `X-Admin-Bootstrap-Key`, variable de entorno nueva, sin default). Pensado para usarse una vez por ambiente, no como flujo de usuario final.
- **Primer filtro JWT en `usuarios`**: hasta ahora `usuarios` firmaba tokens pero nunca validaba ninguno (no tenía nada que proteger). Se agregó el mismo patrón `JwtAuthFilter`/`SecurityConfig` de los demás microservicios para poder exigir `hasRole('ADMIN')` en los endpoints nuevos.
- **`GET/PUT /api/admin/users`** (nuevo, `usuarios`): listar todos los usuarios y suspender/reactivar una cuenta (`status: ACTIVE|SUSPENDED`) — un usuario suspendido no puede volver a loguearse (`AppUserService.login` ya validaba `status == ACTIVE` desde la Iteración 8, ahora hay una UI real para cambiarlo).
- **`GET /api/admin/company-profiles`** (nuevo, `perfiles`) y **`GET /api/admin/job-offers`** (nuevo, `ofertas`, incluye ofertas cerradas): listados administrativos, protegidos con `@PreAuthorize("hasRole('ADMIN')")` como capa independiente del filtro de URL (que en esos dos servicios sigue permitiendo `GET /api/**` públicamente por diseño — la anotación de método es la que realmente bloquea).
- **Frontend**: las 4 páginas de Admin (antes vacías del scaffold original) ahora funcionan: `AdminDashboard.jsx` (estadísticas agregadas), `User.jsx` (tabla de usuarios con suspender/reactivar), `Companies.jsx`, `Offers.jsx` — con un `AdminNav.jsx` compartido a modo de tabs. `Navbar.jsx` muestra "Panel de administración" cuando el rol es `ADMIN`.
- Validado con curl: bootstrap con clave correcta (200) / incorrecta (403), login admin, listar usuarios, suspender un usuario y confirmar que no puede loguearse, reactivarlo, listar empresas/ofertas (incluida una cerrada), y confirmar 403 para cualquiera de estos endpoints sin ser ADMIN.

### `notificaciones` (antes 100% stub) — implementado completo, con integración real entre microservicios

- `Notification` mapea la tabla `notification` (`user_id` referencia `app_user` directo, no una tabla de perfil — simplifica todo).
- Endpoints: `GET /api/notifications/mine`, `GET /api/notifications/unread-count`, `PUT /api/notifications/{id}/read` (JWT de usuario, cualquier rol) y `POST /api/notifications/internal` (protegido por una clave compartida nueva, `INTERNAL_SERVICE_KEY`/header `X-Internal-Service-Key` — no hay un usuario humano detrás de esa llamada, la hacen otros microservicios).
- **Primera integración HTTP real entre microservicios del proyecto** (hasta ahora todo el cruce de datos entre servicios era vía lectura directa del esquema compartido — refs de solo lectura — nunca una llamada de red real). Se agregó `NotificationClient` (usa `RestClient` de Spring, ya disponible vía `spring-boot-starter-webmvc`) en `ofertas` y `resenias`:
  - `ofertas`: notifica a la empresa cuando recibe una postulación, al profesional cuando su postulación es aceptada/rechazada, al profesional cuando recibe una cotización, al cliente cuando su cotización es aceptada/rechazada.
  - `resenias`: notifica al profesional cuando recibe una reseña nueva.
  - **Resiliente a propósito**: cualquier falla al notificar se registra (`log.warn`) y se ignora — notificar es un efecto secundario, nunca debe tumbar la operación principal (postular, cotizar, reseñar). Mismo principio de resiliencia que el fallback a mock del frontend (Iteración 7).
- Agregado a `docker-compose.yml` (puerto 8086) y al CI. `ofertas`/`resenias` ahora dependen de `notificaciones` en el compose (mejor orden de arranque, aunque las llamadas de notificación no son estrictamente bloqueantes).
- **Frontend**: `NotificationBell.jsx` (nuevo) en el `Navbar` — ícono de campana con contador de no leídas (poll cada 30s), dropdown con la lista, marca como leída al hacer click. Solo visible con sesión activa.
- Validado con curl de punta a punta: profesional publica servicio → cliente lo cotiza → **la notificación llega automáticamente al profesional a través de la llamada real entre `ofertas` y `notificaciones`** → marcar como leída → contador baja a 0 → protección del endpoint interno con clave incorrecta (403) → un usuario no puede marcar como leída una notificación ajena (403).
- 3 tests unitarios nuevos, los 4 de `notificaciones` (incluyendo el de contexto) pasan.

### Verificación end-to-end (Playwright, 3 pestañas: empresa/profesional/admin)

Empresa publica oferta → la edita → profesional postula → empresa acepta la postulación → empresa cierra la oferta → **profesional ve la notificación de "postulación aceptada" en la campana** → admin inicia sesión → ve el dashboard con estadísticas → suspende al profesional desde el panel → ve la oferta cerrada en el listado de todas las ofertas. 9 pasos, todos correctos (uno falló por un bug en el script de prueba, no en la app — se verificó por separado que sí funciona).

Todo contra el stack 100% dockerizado — ahora **7 contenedores** (`db`, `usuarios`, `catalogo`, `ofertas`, `perfiles`, `resenias`, `notificaciones`), todos `healthy`.

## 21. Iteración 13 — Landing funcional de punta a punta (bugs reales encontrados probando en vivo) — COMPLETADA

El usuario probó la Landing en su propio navegador (por primera vez desde que el foco pasó a los microservicios) y encontró varios botones/links completamente inertes — confirmado con Playwright antes de tocar código, para no arreglar a ciegas.

### Bugs confirmados y su causa

- **Botón "Publicar servicio" del Hero**: `<motion.button>` sin `onClick` — nunca hizo nada, en ninguna sesión.
- **Barra de búsqueda del Hero**: el `<input>` no estaba dentro de un `<form>` y no tenía `onSubmit` ni estado — escribir y presionar Enter no hacía nada.
- **Botones del CTA final** ("Publicar un servicio", "Explorar servicios"): mismo problema, sin `onClick`.
- **Links del Navbar** (Servicios/Cómo funciona/Destacados/Confianza): dentro de la Landing sí funcionaban (confirmado con Playwright: el scroll ocurre), pero sin `scroll-behavior: smooth` el salto era instantáneo y sin `scroll-margin-top` el título de la sección quedaba tapado por el navbar sticky.
- **Bug real adicional, encontrado por el usuario después de la primera verificación**: esos mismos links del Navbar (y los equivalentes del Footer) eran `<a href="#servicios">` planos. Si el usuario estaba en cualquier ruta que **no** fuera la Landing (ej. `/servicios-profesionales?q=Design`), el navegador solo le pegaba el hash a la URL actual (`/servicios-profesionales?q=Design#como-funciona`) en vez de navegar a `/` — como esa sección no existe fuera de la Landing, el click "no hacía nada".
- **Categorías de la sección "Explora por categoría"**: botones sin `onClick`, puramente decorativos.
- **`/ofertas` con una sola oferta**: no era un bug de código — la base de datos del `docker-compose` (creada desde cero en la Iteración 9) solo tenía datos de prueba generados por los propios scripts de Playwright de esta sesión (nombres como "E2E Ofertas SPA"), casi todos ya cerrados.

### Arreglos

- **`lib/api.js`**: ya existía `createCompanyService` (Iteración 11) pero **no tenía página de frontend** — una empresa podía publicar ofertas de trabajo pero no un servicio de catálogo propio. Se creó **`pages/Company/CreateCompanyService.jsx`** (`/empresa/publicar-servicio`, mismo patrón que `CreateService.jsx` de profesionales) y se agregó su link en `CompanyOffers.jsx`.
- **`Landing.jsx`**: función `publishServiceRoute(session)` que decide a dónde va "Publicar servicio" según el rol (`null` → `/registro`, `PROFESSIONAL` → `/profesional/publicar-servicio`, `COMPANY` → `/empresa/publicar-servicio`, resto → `/servicios-profesionales`), usada tanto en el botón del Hero como en el del CTA final. El buscador del Hero ahora es un `<form>` real que navega a `/servicios-profesionales?q=<término>`. Las 6 categorías navegan a esa misma ruta con un `query` keyword mapeado a un término de categoría real del backend (ej. "Desarrollo & Tecnología" → `Development`).
- **`pages/User/ProfessionalServices.jsx`**: nueva barra de búsqueda (lee/escribe el parámetro `?q=` de la URL) que filtra por título, descripción, categoría o nombre del profesional — consume las búsquedas que vienen del Hero y de las categorías.
- **`index.css`**: `scroll-behavior: smooth` (respetando `prefers-reduced-motion`) + `scroll-margin-top: 88px` en `section[id]` para que los anchors no queden tapados por el navbar sticky.
- **Datos de ejemplo**: se registraron 4 empresas limpias (mismos nombres usados en `99_seed_demo_data.sql` de la Iteración 7, por consistencia narrativa: Andes Design Studio, NovaCode Labs, Consultora Bravo & Ríos, ObraSur Construcciones) y se publicaron 7 ofertas de trabajo reales y variadas (diseño, desarrollo, legal, construcción) vía `curl` contra el stack en vivo. Se cerró la única oferta con nombre de prueba que quedaba activa.
- **Fix del bug de anchors cross-ruta**: en `Navbar.jsx` y `Footer.jsx` los links a secciones (`Servicios`, `Cómo funciona`, `Destacados`, `Confianza`, más "Verificación"/"Casos de éxito" del Footer) pasaron de `<a href="#seccion">` a `<Link to="/#seccion">` de React Router, para que siempre naveguen primero a `/`. En `Landing.jsx` se agregó un `useEffect` que escucha `location.hash` (de `useLocation`) y hace `scrollIntoView({ behavior: 'smooth' })` al elemento correspondiente — funciona tanto al llegar desde otra ruta (mount inicial con hash) como al cambiar de sección estando ya en la Landing. De paso, en `Footer.jsx` "Publicar un servicio" ahora usa el mismo `publishServiceRoute(session)` que Hero/FinalCta (antes era `href="#"`, un link muerto) y "Crear perfil de empresa" apunta a `/registro`.

### Verificación

9 pasos con Playwright contra el stack en vivo: scroll suave a `#servicios`, click en categoría navega con el filtro correcto, el buscador de `ProfessionalServices` filtra de verdad, el botón del Hero sin sesión va a `/registro`, el buscador del Hero navega con el término, "Explorar servicios" navega, `/ofertas` muestra 7 ofertas reales (antes 1), y una empresa logueada ve su botón "Publicar servicio" llevarla a `/empresa/publicar-servicio`. Sin errores de consola. `npm run lint`/`build` limpios.

Verificación adicional tras el fix de anchors cross-ruta: desde `/servicios-profesionales?q=Design` (ruta distinta a la Landing), click en "Cómo funciona", "Destacados", "Confianza" y "Servicios" del Navbar navegan a `/` y hacen scroll suave a cada sección (`boundingBox().y ≈ 88`, coincidiendo con el `scroll-margin-top`); mismo resultado clickeando "Cómo funciona" del Footer desde `/ofertas`. Cero errores de consola. `npm run lint`/`build` limpios de nuevo.

## 22. Handoff a próxima sesión (2026-08-05, actualizado tras Iteración 13)

Los 6 microservicios de negocio están completos y la Landing ahora es completamente funcional (no solo visualmente terminada). Pendiente conocido: `CompanyService`/`ProfessionalService` todavía no tienen edición/despublicación (identificado pero no implementado en esta iteración, ver sección 23).

**Permisos de `.claude/settings.json` (proyecto)** — se agregó `"Skill(*)"` a la lista `allow` en la sesión de la Iteración 7 (antes solo `Skill(update-config)` estaba permitido). Con esto, `Bash(*)`, `Edit(*)`, `Write(*)`, `Read(*)`, `Agent(*)`, `Skill(*)`, `WebFetch(*)` y `WebSearch(*)` ya cubren prácticamente cualquier acción de archivo/terminal/agente/skill sin prompt de aprobación — no falta ninguna herramienta de ese tipo por habilitar.

Lo que **no** se puede resolver vía `settings.json` (son mecanismos de aprobación distintos, no permisos de herramienta):
- **`AskUserQuestion`**: es una herramienta inherentemente interactiva que uso por elección propia para aclarar ambigüedad — ninguna configuración de permisos la puede "pre-aprobar". Dado el contexto ya autorizado de este proyecto, se debe evitar usarla salvo ambigüedad genuina y proceder con criterio propio en su lugar (documentando la decisión tomada aquí, en vez de preguntar).
- **Modo Plan (`EnterPlanMode`/`ExitPlanMode`)**: el modo plan requiere aprobación del usuario por diseño; no es algo que `settings.json` pueda deshabilitar. Evitar entrar en modo plan para trabajo ya autorizado en este proyecto.
- Existe la opción `permissions.defaultMode: "bypassPermissions"` en `settings.json`, que sí eliminaría cualquier prompt de confirmación restante (incluso para acciones destructivas). No se activó porque es una decisión de seguridad que el usuario debería tomar explícitamente, no algo para setear en silencio — queda como opción disponible si se quiere ir un paso más allá.

## 23. Próximos pasos

1. **`CompanyService`/`ProfessionalService` sin editar/despublicar**: igual que `JobOffer` antes de la Iteración 12, hoy solo se puede crear un servicio de catálogo, no editarlo ni darlo de baja. Mismo patrón a replicar (`update`/`close` en el service + endpoint + botones en `MyServices.jsx`/una futura página de "mis servicios" para empresas).
2. Mostrar rating/reseñas en las cards de `ProfessionalServices.jsx` (hoy `resenias` solo se consume desde `MyQuotations.jsx` para dejar una reseña, no se muestra el promedio en el listado público) — requiere agregar `professionalId` a `ProfessionalServiceListingView` en `catalogo`.
3. El panel de Admin no gestiona profesionales/servicios, solo empresas y ofertas de trabajo — falta el equivalente para tener paridad completa.
4. Reemplazar los joins nativos cross-tabla (`CompanyServiceRepository`/`ProfessionalServiceRepository` en `catalogo`, `ReviewRepository.hasAcceptedEngagement` en `resenias`) por llamadas reales entre microservicios — ahora que `NotificationClient`/`RestClient` ya demostró el patrón para llamadas HTTP reales (Iteración 12), sería el siguiente paso natural para dejar de leer tablas ajenas directamente.
5. Componentes de catálogo pendientes del scaffold original que aún no se necesitaron: `SearchBar.jsx`, `Sidebar.jsx`, `Modal.jsx`, `Button.jsx`, `CampanyCard.jsx`, `UserCard.jsx`.
6. Considerar un botón de cambio de tema (claro/oscuro) en el Navbar — las variables CSS para `[data-theme="light"]` ya existen en `index.css`, pero no hay ningún control en la UI que las active todavía.
7. La campana de notificaciones (`NotificationBell.jsx`) solo está en el Navbar de escritorio, falta agregarla al menú móvil.
8. **Pendientes que quedan fuera de alcance porque requieren decisiones de producto o servicios/credenciales externas** (no se pueden resolver de forma autónoma): "olvidé mi contraseña"/verificación de email (necesita un proveedor de correo tipo Resend con API key del usuario), refresh tokens/revocación de JWT, API Gateway único en vez de que el frontend le pegue a cada microservicio por puerto, HTTPS, dominio propio y hosting real (deploy fuera de `localhost`), rate limiting distribuido (Redis) si se escala a más de una instancia de cualquier microservicio, backups de la base de datos, OpenAPI/Swagger para los endpoints existentes.
