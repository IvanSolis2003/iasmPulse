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
- **Fase 2 — Endpoint de ingesta**: `POST /api/collect` listo, con CORS abierto para
  recibir eventos desde los sitios trackeados.
- Fases 3 a 8: pendientes.

## Ramas

- `main` — rama estable, desde donde se despliega
- `staging` — integración de cada etapa
