# B2BMatch — Marketplace B2B de servicios profesionales

Plataforma que conecta **clientes**, **profesionales independientes**, **empresas** y un rol **admin** alrededor de ofertas de trabajo, cotizaciones, servicios de catálogo y reseñas. Es "matching" de talento/servicios: profesionales y empresas publican servicios u ofertas, los clientes los contratan.

> Nota histórica: existió una versión anterior 100% estática (HTML/CSS/JS + `localStorage`, sin backend real). Esa versión fue completamente reemplazada por la arquitectura descrita abajo. El detalle completo de cómo y por qué está en [`PROGRESO.md`](PROGRESO.md).

## Arquitectura

- **`BACKEND/`** — 6 microservicios Spring Boot 4 / Java 21, cada uno con su propio `Dockerfile`, compartiendo un único schema Postgres (`b2bmatch`).
- **`FRONTEND/`** — React 19 + Vite + React Router 7 + Tailwind v4 + Framer Motion.
- **`DATABASE/`** — scripts SQL de referencia (documentación); el schema real lo aplica Flyway automáticamente al levantar `usuarios` (ver más abajo).

| Servicio | Puerto | Responsabilidad |
|---|---|---|
| `db` (Postgres 16) | 5434→5432 | Única base de datos, schema `b2bmatch` |
| `usuarios` | 8081 | Registro/login, JWT, cuentas, bootstrap de admin |
| `perfiles` | 8082 | Perfiles de empresa/profesional/cliente |
| `catalogo` | 8083 | Categorías y servicios publicados (empresa/profesional) |
| `ofertas` | 8084 | Ofertas de trabajo, postulaciones, cotizaciones |
| `resenias` | 8085 | Reseñas de clientes a profesionales |
| `notificaciones` | 8086 | Notificaciones internas (recibidas vía llamada HTTP de `ofertas`/`resenias`) |
| Frontend (Vite dev server) | 5173 | No corre en Docker — se levanta aparte con `npm run dev` |

Cada microservicio valida JWT de forma independiente con el mismo `JWT_SECRET` que emite `usuarios`. La comunicación entre microservicios es HTTP real (no hay API Gateway todavía): el frontend le pega directo a cada puerto.

## Requisitos previos

- **Docker** + **Docker Compose v2** (`docker compose version`)
- **Node.js 20+** y npm (para el frontend, que corre fuera de Docker)
- Opcional: **Java 21** + **Maven** solo si vas a correr algún microservicio fuera de Docker o sus tests localmente

## Puesta en marcha

### 1. Variables de entorno

```bash
cp .env.example .env
cp FRONTEND/.env.example FRONTEND/.env
```

Editá `.env` (raíz) y generá secretos propios — **nunca reutilices los de otro ambiente**:

```bash
openssl rand -base64 48   # para JWT_SECRET
openssl rand -base64 24   # para ADMIN_BOOTSTRAP_KEY e INTERNAL_SERVICE_KEY
```

`FRONTEND/.env.example` ya trae los puertos correctos por defecto (`localhost:8081`–`8086`); normalmente no necesitás tocarlo si corrés todo en local.

### 2. Levantar el backend (Docker Compose)

```bash
docker compose up --build -d
docker compose ps   # esperar a que los 7 contenedores queden "healthy"
```

La primera vez que arranca `usuarios`, aplica automáticamente las 18 migraciones Flyway sobre una base vacía (el resto de los servicios esperan a que `usuarios` esté healthy antes de arrancar, porque validan el schema con Hibernate en modo `validate`, sin crearlo).

```bash
docker compose logs -f usuarios   # ver el log de arranque/migraciones si algo falla
docker compose down               # bajar todo (agregar -v para borrar también el volumen de datos)
```

### 3. Crear la cuenta admin

No hay registro público de rol `ADMIN` (a propósito). Se crea una única vez por ambiente con la clave de bootstrap:

```bash
curl -X POST http://localhost:8081/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -H "X-Admin-Bootstrap-Key: <el ADMIN_BOOTSTRAP_KEY de tu .env>" \
  -d '{"email":"admin@tudominio.cl","password":"UnaPasswordSegura123"}'
```

### 4. Levantar el frontend

```bash
cd FRONTEND
npm install
npm run dev
```

Abrí `http://localhost:5173`. Registrate como cliente/profesional/empresa desde `/registro`, o entrá con la cuenta admin creada en el paso 3.

## Comandos útiles

```bash
# Backend
docker compose up --build -d      # levantar todo
docker compose logs -f <servicio> # ver logs de un microservicio
docker compose down                # bajar todo (sin borrar datos)
docker compose down -v             # bajar todo y borrar el volumen de Postgres

# Frontend
npm run lint    # ESLint
npm run build   # build de producción (vite build)
npm run preview # servir el build de producción localmente

# Backend — tests de un microservicio puntual (requiere Java 21 + Maven, fuera de Docker)
cd BACKEND/usuarios && mvn test
```

## CI

`.github/workflows/ci.yml` corre en cada push/PR a `main`: lint + build del frontend, y los tests de los 6 microservicios contra un Postgres efímero (usa secretos dummy propios de CI, nunca los reales).

## Estado del proyecto, decisiones y pendientes

Este README cubre solo "cómo levantarlo". El **historial completo de decisiones, qué se probó, qué falta y por qué se hizo cada cosa así** vive en [`PROGRESO.md`](PROGRESO.md) — es la bitácora que cualquier persona (o cualquier sesión nueva de un asistente de IA) debería leer primero para retomar el trabajo sin perder contexto.
