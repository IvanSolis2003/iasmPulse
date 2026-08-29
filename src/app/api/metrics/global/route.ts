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

export async function GET(request: NextRequest) {
  const dias = parsearDias(request.nextUrl.searchParams.get("range"));
  const desde = new Date();
  desde.setUTCHours(0, 0, 0, 0);
  desde.setUTCDate(desde.getUTCDate() - (dias - 1));

  const hace5Minutos = new Date(Date.now() - 5 * 60 * 1000);

  const [sites, pageviews, clicks, eventosRecientes] = await Promise.all([
    prisma.site.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, domain: true, color: true },
    }),
    prisma.event.findMany({
      where: { type: "pageview", timestamp: { gte: desde } },
      select: { siteId: true, url: true, referrer: true, sessionId: true, metadata: true, timestamp: true },
    }),
    prisma.clickEvent.findMany({
      where: { timestamp: { gte: desde } },
      select: { siteId: true },
    }),
    prisma.event.findMany({
      where: { timestamp: { gte: hace5Minutos } },
      select: { sessionId: true, siteId: true, url: true },
    }),
  ]);

  const sesionesEnVivo = new Set(eventosRecientes.map((e) => e.sessionId));
  const activosAhora = sesionesEnVivo.size;

  const fechasArray: string[] = [];
  for (let i = 0; i < dias; i++) {
    const dia = new Date(desde);
    dia.setUTCDate(desde.getUTCDate() + i);
    fechasArray.push(fechaISO(dia));
  }

  const mapaSitio = new Map<string, { name: string; color: string }>();
  for (const s of sites) {
    mapaSitio.set(s.id, { name: s.name, color: s.color || "#2E7D32" });
  }

  const porDiaMap = new Map<string, Record<string, number>>();
  for (const f of fechasArray) {
    const inicial: Record<string, number> = { total: 0 };
    for (const s of sites) {
      inicial[s.id] = 0;
    }
    porDiaMap.set(f, inicial);
  }

  const siteStatsMap = new Map<
    string,
    { visitas: number; sesiones: Set<string>; clicks: number }
  >();
  for (const s of sites) {
    siteStatsMap.set(s.id, { visitas: 0, sesiones: new Set<string>(), clicks: 0 });
  }

  const paginasGlobales = new Map<string, number>();
  const referrersGlobales = new Map<string, number>();
  const paisesGlobales = new Map<string, number>();
  const sesionesGlobales = new Set<string>();

  for (const pv of pageviews) {
    const f = fechaISO(pv.timestamp);
    const fila = porDiaMap.get(f);
    if (fila) {
      fila.total = (fila.total || 0) + 1;
      fila[pv.siteId] = (fila[pv.siteId] || 0) + 1;
    }

    const st = siteStatsMap.get(pv.siteId);
    if (st) {
      st.visitas += 1;
      st.sesiones.add(pv.sessionId);
    }

    sesionesGlobales.add(pv.sessionId);
    paginasGlobales.set(pv.url, (paginasGlobales.get(pv.url) ?? 0) + 1);

    const ref = pv.referrer || "Directo";
    referrersGlobales.set(ref, (referrersGlobales.get(ref) ?? 0) + 1);

    if (pv.metadata && typeof pv.metadata === "object") {
      const meta = pv.metadata as Record<string, unknown>;
      if (typeof meta.country === "string" && meta.country.length > 0) {
        const info = obtenerPaisInfo(meta.country);
        const etiqueta = `${info.bandera} ${info.nombre}`;
        paisesGlobales.set(etiqueta, (paisesGlobales.get(etiqueta) ?? 0) + 1);
      }
    }
  }

  for (const cl of clicks) {
    const st = siteStatsMap.get(cl.siteId);
    if (st) {
      st.clicks += 1;
    }
  }

  const totalVisitasGlobal = pageviews.length;

  const sitesRendimiento = sites.map((s) => {
    const st = siteStatsMap.get(s.id);
    const visitas = st?.visitas ?? 0;
    const sesiones = st?.sesiones.size ?? 0;
    const clicsCount = st?.clicks ?? 0;
    const participacion =
      totalVisitasGlobal > 0 ? Math.round((visitas / totalVisitasGlobal) * 100) : 0;

    return {
      id: s.id,
      name: s.name,
      domain: s.domain,
      color: s.color || "#2E7D32",
      visitas,
      sesiones,
      clicks: clicsCount,
      participacion,
    };
  });

  const porDia = fechasArray.map((fecha) => {
    const datos = porDiaMap.get(fecha) || { total: 0 };
    return {
      fecha,
      ...datos,
    };
  });

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

  return NextResponse.json({
    totalVisitas: totalVisitasGlobal,
    sesionesUnicas: sesionesGlobales.size,
    totalClicks: clicks.length,
    activosAhora,
    porDia,
    sites: sitesRendimiento,
    topPaginas: topN(paginasGlobales, 10),
    topReferrers: topN(referrersGlobales, 10),
    paises: topN(paisesGlobales, 8),
  });
}
