# iasmPulse

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript) ![Prisma](https://img.shields.io/badge/ORM-Prisma%207-2D3748?logo=prisma) ![Postgres](https://img.shields.io/badge/DB-Neon%20Postgres-336791?logo=postgresql) ![MUI](https://img.shields.io/badge/UI-Material%20UI-007FFF?logo=mui) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

Plataforma propia de analítica web (self-hosted) para trackear todas las apps de [iasmtech](https://iasmtech.com) desde un único panel: pageviews, clicks, heatmaps, embudos de conversión, campañas UTM, disponibilidad (uptime) y Core Web Vitals — sin depender de Google Analytics ni de ningún servicio de terceros de pago.

## Qué resuelve

Iván mantiene varias apps propias (RutinIA, JuntaDigital, SalónApp, Davielle, etc.) y necesitaba saber qué pasa en cada una sin instalar un SDK de analítica distinto por proyecto ni ceder los datos a un tercero. iasmPulse es un único script de tracking (`track.js`, sin dependencias) que se pega en cualquier sitio y alimenta un panel centralizado con métricas en tiempo real, comportamiento del usuario y salud técnica de cada app.

## Features

- **Panel global multi-app**: resumen consolidado de todos los sitios registrados y visitantes activos en tiempo real (últimos 5 minutos).
- **Resumen por sitio**: visitas totales, sesiones únicas, visitas por día, top páginas y top referrers, con selector de rango (7/30/90 días).
- **Heatmaps de clicks**: overlay de calor por página, con desglose por dispositivo/navegador y filtros.
- **Embudos de conversión (funnels)**: seguimiento de abandono paso a paso.
- **Campañas UTM y objetivos de conversión**.
- **Profundidad de scroll y rage-click detection** para detectar fricción en la UX.
- **Geolocalización por país** (con bandera emoji) sin usar cookies, a partir del header de IP del edge.
- **Detección automática de 404** y de clicks en enlaces salientes (WhatsApp/Instagram).
- **Monitor de disponibilidad (uptime)**: chequeo periódico de estado y latencia por sitio, con validación anti-SSRF y sanitización de la respuesta antes de mostrarla.
- **Core Web Vitals** (LCP, CLS, TTFB) con semáforos de Google.
- **Auth de un solo usuario** (NextAuth v5 + credenciales) — no es multi-tenant, es el panel privado de Iván.

## Stack

- Next.js 16 (App Router) + TypeScript
- Prisma 7 + Postgres (Neon)
- MUI (Material UI) — tema verde/blanco propio, rediseño estilo "Berry"
- Vercel

## Arquitectura

El modelo de datos se mantiene deliberadamente simple —`Site`, `Event`, `ClickEvent`— y cada feature nueva (funnels, campañas, scroll depth, rage clicks, web vitals, 404s) se implementa como un `Event.type` distinto con su propio `metadata` en JSON, en vez de agregar una tabla por feature. Esto permite sumar señales nuevas sin migraciones de esquema.

```
public/track.js          # script de tracking (~sin dependencias), pageview + click + eventos custom
src/app/api/collect      # ingesta: valida payload, verifica que el origen coincida con el dominio
                          # registrado del sitio, geolocaliza por IP y excluye IPs propias
src/app/api/sites/[id]/  # metrics, heatmap, funnel, uptime — por sitio
src/app/api/metrics/global  # panel consolidado multi-sitio + visitantes en tiempo real
```

**Seguridad del endpoint de ingesta**: `POST /api/collect` valida que el `Origin`/`Referer` de la request coincida con el dominio registrado del `Site` antes de aceptar el evento, y permite excluir IPs propias vía `EXCLUDED_IPS` para no contaminar las métricas con las visitas del propio autor.

### Modelo de datos

```prisma
model Site        { id, name, domain, color, events[], clicks[] }
model Event       { id, siteId, type, url, referrer, sessionId, metadata (Json), timestamp }
model ClickEvent  { id, siteId, url, x, y, viewportWidth, viewportHeight, timestamp }
```

## Instalar el script de tracking en un sitio

```html
<script src="https://pulse.iasmtech.com/track.js" data-site="dominio-del-sitio"></script>
```

`data-site` debe coincidir exactamente con el `domain` con el que se registró el `Site` en iasmPulse.

## Puesta en marcha

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

`DATABASE_URL` debe apuntar a la base Neon del proyecto.

## Variables de entorno

- `DATABASE_URL` — connection string de Neon (pooler)
- `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (hash bcrypt, nunca la contraseña en texto plano):
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"   # AUTH_SECRET
  node -e "console.log(require('bcryptjs').hashSync('tu-password', 10))"       # ADMIN_PASSWORD_HASH
  ```
  En `.env` local hay que escapar cada `$` del hash bcrypt como `\$` (Next.js interpreta `$` como interpolación); en Vercel se pega el hash tal cual.
- `EXCLUDED_IPS` (opcional) — IPs a excluir de las métricas, separadas por coma.

## Ramas y flujo de trabajo

- `main` — rama estable, desde donde se despliega.
- `staging` — integración de cada etapa.
- `feature/*` — cada cambio nuevo arranca en su propia rama desde `staging` y se mergea a `staging` al terminar.

## Deploy (Vercel)

1. Importar el repo en Vercel apuntando a la rama `main`.
2. Configurar las variables de entorno del proyecto (valores reales, sin escapar `$`).
3. Build command y output por defecto — no requieren configuración especial.
4. Dominio propio (`pulse.iasmtech.com`) desde la pestaña Domains.
5. Antes del primer deploy en un ambiente nuevo: `npx prisma migrate deploy` contra la misma base de Neon.

## Autor

**Iván Solís Manqueo** — Full Stack Developer, Talca, Chile
[iasmtech.com](https://iasmtech.com) · [ivan.solis20.m@gmail.com](mailto:ivan.solis20.m@gmail.com)

Herramienta interna de uso personal, no está pensada como producto multi-tenant.
