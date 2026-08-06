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
- Fases 5 a 8: pendientes.

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
