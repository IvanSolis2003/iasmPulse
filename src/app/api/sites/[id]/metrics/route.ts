import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { obtenerPaisInfo } from "@/lib/paises";

const RANGO_POR_DEFECTO = 7;
const RANGO_MAXIMO = 90;

function parsearDias(rango: string | null): number {
  if (!rango) return RANGO_POR_DEFECTO;
  const match = /^(\d+)d$/.exec(rango);
  if (!match) return RANGO_POR_DEFECTO;
  const dias = Number(match[1]);
  return Math.min(Math.max(dias, 1), RANGO_MAXIMO);
}

function fechaISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const site = await prisma.site.findUnique({ where: { id } });
  if (!site) {
    return NextResponse.json({ error: "Sitio no encontrado" }, { status: 404 });
  }

  const dias = parsearDias(request.nextUrl.searchParams.get("range"));
  const desde = new Date();
  desde.setUTCHours(0, 0, 0, 0);
  desde.setUTCDate(desde.getUTCDate() - (dias - 1));

  const todosEventos = await prisma.event.findMany({
    where: { siteId: id, timestamp: { gte: desde } },
    select: { type: true, url: true, referrer: true, sessionId: true, metadata: true, timestamp: true },
  });

  const pageviews = todosEventos.filter((e) => e.type === "pageview");
  const eventosCustom = todosEventos.filter((e) => e.type === "custom");

  const porDiaMapa = new Map<string, number>();
  for (let i = 0; i < dias; i++) {
    const dia = new Date(desde);
    dia.setUTCDate(desde.getUTCDate() + i);
    porDiaMapa.set(fechaISO(dia), 0);
  }
  for (const evento of pageviews) {
    const clave = fechaISO(evento.timestamp);
    if (porDiaMapa.has(clave)) {
      porDiaMapa.set(clave, (porDiaMapa.get(clave) ?? 0) + 1);
    }
  }

  const paginasMapa = new Map<string, number>();
  const referrersMapa = new Map<string, number>();
  const dispositivosMapa = new Map<string, number>();
  const navegadoresMapa = new Map<string, number>();
  const osMapa = new Map<string, number>();
  const campanasMapa = new Map<string, number>();
  const customEventsMapa = new Map<string, number>();
  const outboundMapa = new Map<string, number>();
  const paginas404Mapa = new Map<string, number>();
  const scrollDepthMapa = new Map<string, number>([
    ["25% de la página", 0],
    ["50% de la página", 0],
    ["75% de la página", 0],
    ["100% (final)", 0],
  ]);
  let rageClicksCount = 0;
  const paisesMapa = new Map<string, number>();
  const sesiones = new Set<string>();

  for (const evento of pageviews) {
    paginasMapa.set(evento.url, (paginasMapa.get(evento.url) ?? 0) + 1);
    const referrer = evento.referrer || "Directo";
    referrersMapa.set(referrer, (referrersMapa.get(referrer) ?? 0) + 1);
    sesiones.add(evento.sessionId);

    if (evento.metadata && typeof evento.metadata === "object") {
      const meta = evento.metadata as Record<string, unknown>;
      const dev = typeof meta.device === "string" ? meta.device : "Desktop";
      const browser = typeof meta.browser === "string" ? meta.browser : "Otro";
      const os = typeof meta.os === "string" ? meta.os : "Otro";

      dispositivosMapa.set(dev, (dispositivosMapa.get(dev) ?? 0) + 1);
      navegadoresMapa.set(browser, (navegadoresMapa.get(browser) ?? 0) + 1);
      osMapa.set(os, (osMapa.get(os) ?? 0) + 1);

      if (typeof meta.country === "string" && meta.country.length > 0) {
        const info = obtenerPaisInfo(meta.country);
        const etiqueta = `${info.bandera} ${info.nombre}`;
        paisesMapa.set(etiqueta, (paisesMapa.get(etiqueta) ?? 0) + 1);
      }

      if (meta.utm && typeof meta.utm === "object") {
        const utm = meta.utm as Record<string, unknown>;
        const camp = typeof utm.campaign === "string" ? utm.campaign : undefined;
        const source = typeof utm.source === "string" ? utm.source : undefined;
        const nombreCampana = camp ? `${camp} (${source || "web"})` : (source ? `Fuente: ${source}` : null);
        if (nombreCampana) {
          campanasMapa.set(nombreCampana, (campanasMapa.get(nombreCampana) ?? 0) + 1);
        }
      }
    }
  }

  for (const c of eventosCustom) {
    if (c.metadata && typeof c.metadata === "object") {
      const meta = c.metadata as Record<string, unknown>;
      const evtName = typeof meta.eventName === "string" ? meta.eventName : "Acción personalizada";

      if (evtName === "outbound_link") {
        const target = (typeof meta.targetUrl === "string" ? meta.targetUrl : "") || (typeof meta.targetHost === "string" ? meta.targetHost : "Enlace externo");
        outboundMapa.set(target, (outboundMapa.get(target) ?? 0) + 1);
      } else if (evtName === "error_404") {
        const brokenUrl = typeof meta.brokenUrl === "string" ? meta.brokenUrl : c.url;
        paginas404Mapa.set(brokenUrl, (paginas404Mapa.get(brokenUrl) ?? 0) + 1);
      } else if (evtName === "scroll_depth") {
        const depth = typeof meta.depth === "string" ? meta.depth : "";
        if (depth === "25%") scrollDepthMapa.set("25% de la página", (scrollDepthMapa.get("25% de la página") ?? 0) + 1);
        if (depth === "50%") scrollDepthMapa.set("50% de la página", (scrollDepthMapa.get("50% de la página") ?? 0) + 1);
        if (depth === "75%") scrollDepthMapa.set("75% de la página", (scrollDepthMapa.get("75% de la página") ?? 0) + 1);
        if (depth === "100%") scrollDepthMapa.set("100% (final)", (scrollDepthMapa.get("100% (final)") ?? 0) + 1);
      } else if (evtName === "rage_click") {
        rageClicksCount += 1;
      } else {
        customEventsMapa.set(evtName, (customEventsMapa.get(evtName) ?? 0) + 1);
      }
    } else {
      customEventsMapa.set("Acción personalizada", (customEventsMapa.get("Acción personalizada") ?? 0) + 1);
    }
  }

  function topN(mapa: Map<string, number>, n: number) {
    const total = Array.from(mapa.values()).reduce((a, b) => a + b, 0);
    return Array.from(mapa.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([nombre, visitas]) => ({
        nombre,
        visitas,
        porcentaje: total > 0 ? Math.round((visitas / total) * 100) : 0,
      }));
  }

  const scrollTotal = pageviews.length;
  const scrollDepthList = Array.from(scrollDepthMapa.entries()).map(([nombre, cantidad]) => ({
    nombre,
    visitas: cantidad,
    porcentaje: scrollTotal > 0 ? Math.min(Math.round((cantidad / scrollTotal) * 100), 100) : 0,
  }));

  return NextResponse.json({
    totalVisitas: pageviews.length,
    sesionesUnicas: sesiones.size,
    totalConversiones: eventosCustom.length,
    rageClicks: rageClicksCount,
    porDia: Array.from(porDiaMapa.entries()).map(([fecha, visitas]) => ({ fecha, visitas })),
    topPaginas: topN(paginasMapa, 10),
    topReferrers: topN(referrersMapa, 10),
    dispositivos: topN(dispositivosMapa, 5),
    navegadores: topN(navegadoresMapa, 5),
    sistemasOperativos: topN(osMapa, 5),
    paises: topN(paisesMapa, 8),
    campanas: topN(campanasMapa, 8),
    eventosPersonalizados: topN(customEventsMapa, 10),
    enlacesSalientes: topN(outboundMapa, 8),
    paginas404: topN(paginas404Mapa, 8),
    scrollDepth: scrollDepthList,
  });
}
