import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

  const pageviews = await prisma.event.findMany({
    where: { siteId: id, type: "pageview", timestamp: { gte: desde } },
    select: { url: true, referrer: true, sessionId: true, timestamp: true },
  });

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
  const sesiones = new Set<string>();

  for (const evento of pageviews) {
    paginasMapa.set(evento.url, (paginasMapa.get(evento.url) ?? 0) + 1);
    const referrer = evento.referrer || "Directo";
    referrersMapa.set(referrer, (referrersMapa.get(referrer) ?? 0) + 1);
    sesiones.add(evento.sessionId);
  }

  function topN(mapa: Map<string, number>, n: number) {
    return Array.from(mapa.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([nombre, visitas]) => ({ nombre, visitas }));
  }

  return NextResponse.json({
    totalVisitas: pageviews.length,
    sesionesUnicas: sesiones.size,
    porDia: Array.from(porDiaMapa.entries()).map(([fecha, visitas]) => ({ fecha, visitas })),
    topPaginas: topN(paginasMapa, 10),
    topReferrers: topN(referrersMapa, 10),
  });
}
