# iasmPulse — Plan de Ejecución

Panel de monitoreo/analytics de un solo usuario (Iván) para trackear sus propias apps: pageviews, clicks, heatmaps y métricas generales. Sirve para Mermax, JuntaDigital, SalónApp, Davielle y futuras apps.

## Stack

- Next.js (App Router) + TypeScript
- Prisma + Neon (Postgres)
- MUI (Material UI)
- Vercel (hosting)
- Auth simple de un solo usuario (NextAuth con credenciales o magic link — sin multi-tenant)

## Modelo de datos (Prisma)

Ver `prisma/schema.prisma`. Modelos: `Site`, `Event`, `ClickEvent`.

## Endpoints API

- `POST /api/collect` — recibe eventos batcheados desde el script de tracking (pageviews + clicks + custom events en un solo payload)
- `GET /api/sites` — lista de sitios (para el sidebar)
- `POST /api/sites` — crear un nuevo sitio a trackear
- `GET /api/sites/:id/metrics?range=7d` — visitas, top páginas, referrers, sesiones
- `GET /api/sites/:id/heatmap?url=...` — puntos de click agregados para una página específica

## Script de tracking (`/public/track.js`)

- Sin dependencias, liviano (<3kb)
- Genera/recupera `sessionId` (localStorage o cookie simple)
- Envía pageview automático al cargar
- Listener de `click` a nivel `document`, captura `x/y` relativos al viewport (0-1) + tamaño de viewport
- Batchea eventos en memoria y los envía cada 5s o al cerrar pestaña con `navigator.sendBeacon`
- Se instala con un `<script>` tag simple: `<script src="https://pulse.iasmtech.com/track.js" data-site="mermax"></script>`
- Fase futura: publicar también como paquete npm instalable

## Diseño del dashboard

- Tema MUI custom: paleta verde + blanco (verde primario `#2E7D32`, blanco como fondo dominante, grises neutros de apoyo)
- Layout: sidebar fijo a la izquierda listando los sitios/apps (cada uno con su nombre y color identificador), área principal con el contenido
- Vistas dentro de cada sitio:
  - **Resumen**: visitas totales, gráfico de visitas por día, top páginas, top referrers, selector de rango de fechas
  - **Heatmap**: selector de página + overlay de calor sobre un mockup/iframe de la página
- Responsive no es prioridad (uso personal, principalmente desktop)

## Fases de implementación

1. **Setup base**: proyecto Next.js + Prisma + Neon, schema inicial, migraciones
2. **Endpoint de ingesta**: `POST /api/collect`, validación básica, guardado batcheado
3. **Script de tracking**: `track.js`, probarlo en un sitio real (ej. Mermax o Davielle)
4. **Auth**: login simple de un solo usuario para proteger el dashboard
5. **Layout del dashboard**: sidebar + tema MUI verde/blanco, listado de sitios
6. **Vista de resumen**: métricas y gráficos por sitio
7. **Vista de heatmap**: agregación de clicks + overlay visual
8. **Deploy**: Vercel + variables de entorno + dominio (ej. `pulse.iasmtech.com`)

## Flujo de trabajo git

- Cada etapa cumplida: commit y push a la rama `staging`
- Cuando todo está listo: merge de `staging` a `main`
- El despliegue se hace siempre desde `main`

## Notas para Claude Code

- Seguir el stack y convenciones ya usadas en otros proyectos de Iván (Next.js + Prisma + MUI)
- Revisar y reutilizar `design-system.md` (v2.1) como base del tema verde/blanco, en vez de definir la paleta desde cero
- Sin comentarios en el código
- Solo tocar archivos dentro del alcance de cada fase
- Reutilizar antes de crear (revisar patrones existentes en otros proyectos antes de escribir código nuevo)
- Priorizar cambios mínimos y quirúrgicos por fase
- No agregar dependencias nuevas sin antes proponerlas
- Todo el código y UI en español donde aplique texto visible al usuario
- Al final de cada fase: correr ESLint y `npm run build`
- Antes de crear cualquier `Site`, preguntar a Iván uno por uno cuáles agregar — nunca crear un `Site` sin confirmación explícita
