# iasmPulse

Panel de monitoreo y analytics de un solo usuario para trackear las apps de iasmtech:
pageviews, clicks, heatmaps y métricas generales.

Ver [PLAN.md](PLAN.md) para el alcance completo y las fases.

## Stack

- Next.js 16 (App Router) + TypeScript
- Prisma 7 + Postgres (Neon)
- MUI (Material UI) — tema verde/blanco basado en el design system v2.1
- Vercel

## Puesta en marcha

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

`DATABASE_URL` debe apuntar a la base Neon del proyecto.

## Estado

- **Fase 1 — Setup base**: completa. Proyecto, schema Prisma, tema MUI y migración
  inicial aplicada contra Neon.
- **Fase 2 — Endpoint de ingesta**: completa. `POST /api/collect` (CORS abierto) y
  `GET`/`POST /api/sites` listos.
- **Fase 3 — Script de tracking**: `public/track.js` (~2.1kb) listo. Falta instalarlo
  en un sitio real para la prueba de campo.
- **Fase 4 — Auth**: completa. Login de un solo usuario (NextAuth v5 + Credentials)
  protege todo excepto `/login`, `/api/auth/*`, `/api/collect` y `/track.js`.
- **Fase 5 — Layout del dashboard**: completa. Sidebar fijo con listado de sitios
  (color + nombre), página de detalle por sitio (`/site/[id]`) y botón de cerrar
  sesión.
- **Fase 6 — Vista de resumen**: completa. `GET /api/sites/:id/metrics?range=7d|30d|90d`
  (visitas totales, sesiones únicas, visitas por día, top páginas, top referrers) y la
  UI correspondiente (KPIs, línea de visitas, barras de ranking) en `/site/[id]`.
- **Fase 7 — Vista de heatmap**: completa. `GET /api/sites/:id/heatmap` (sin `url`
  lista páginas con conteo de clicks; con `url` devuelve los puntos agregados) y la
  UI en `/site/[id]` (pestaña Heatmap): selector de página + overlay de calor sobre
  un mockup, dibujado en `<canvas>` nativo con una rampa secuencial derivada del
  verde del tema (sin librerías nuevas).
- **Fase 8 — Deploy**: pendiente el paso final (merge a `main` + configuración en
  Vercel), ver sección "Deploy" más abajo.

## Variables de entorno de auth

`AUTH_SECRET`, `ADMIN_EMAIL` y `ADMIN_PASSWORD_HASH` (hash bcrypt, nunca la
contraseña en texto plano). Generar con:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"   # AUTH_SECRET
node -e "console.log(require('bcryptjs').hashSync('tu-password', 10))"       # ADMIN_PASSWORD_HASH
```

**Importante en `.env` local:** Next.js interpreta `$` como interpolación de
variables al leer `.env`. El hash de bcrypt empieza con `$2b$10$...`, así que hay
que escapar cada `$` como `\$` en el archivo `.env` (no en `.env.example`, y
tampoco al pegarlo en las variables de entorno de Vercel — ahí va el hash tal cual,
tal como en `.env.example`).

## Instalar el script de tracking en un sitio

```html
<script src="https://pulse.iasmtech.com/track.js" data-site="dominio-del-sitio"></script>
```

`data-site` debe ser exactamente el valor de `domain` con el que se registró el
`Site` en iasmPulse.

## Ramas

- `main` — rama estable, desde donde se despliega
- `staging` — integración de cada etapa

## Deploy (Vercel)

1. Importar el repo en Vercel apuntando a la rama `main`.
2. Variables de entorno del proyecto en Vercel (valores reales, sin escapar `$`):
   - `DATABASE_URL` — connection string de Neon (usar la de pooler)
   - `AUTH_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH`
3. Build command por defecto (`next build`) y output por defecto — no requieren
   configuración especial.
4. Dominio propio (ej. `pulse.iasmtech.com`) desde la pestaña Domains del proyecto
   en Vercel.
5. Antes del primer deploy en un ambiente nuevo, correr `npx prisma migrate deploy`
   contra la misma base de Neon (las migraciones ya están en `prisma/migrations`).
