import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const RANGO_POR_DEFECTO = 30;
const RANGO_MAXIMO = 90;

function parsearDias(rango: string | null): number {
  if (!rango) return RANGO_POR_DEFECTO;
  const match = /^(\d+)d$/.exec(rango);
  if (!match) return RANGO_POR_DEFECTO;
  const dias = Number(match[1]);
  return Math.min(Math.max(dias, 1), RANGO_MAXIMO);
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
  const stepsParam = request.nextUrl.searchParams.get("steps");

  const desde = new Date();
  desde.setUTCHours(0, 0, 0, 0);
  desde.setUTCDate(desde.getUTCDate() - (dias - 1));

  const events = await prisma.event.findMany({
    where: { siteId: id, timestamp: { gte: desde } },
    select: { url: true, sessionId: true, timestamp: true, metadata: true },
    orderBy: { timestamp: "asc" },
  });

  const sessionEventsMap = new Map<string, { url: string; timestamp: Date }[]>();
  const topPagesMap = new Map<string, number>();

  for (const e of events) {
    const list = sessionEventsMap.get(e.sessionId) || [];
    list.push({ url: e.url, timestamp: e.timestamp });
    sessionEventsMap.set(e.sessionId, list);

    topPagesMap.set(e.url, (topPagesMap.get(e.url) ?? 0) + 1);
  }

  const topPages = Array.from(topPagesMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([url]) => url);

  const steps = stepsParam
    ? stepsParam.split(",").map((s) => s.trim()).filter(Boolean)
    : topPages.slice(0, 3);

  if (steps.length === 0) {
    steps.push("/");
  }

  const funnelSteps: {
    paso: number;
    nombre: string;
    sesiones: number;
    porcentajeDelInicio: number;
    tasaCaidaAnterior: number;
  }[] = [];

  let sesionesCandidatas: Set<string> = new Set(sessionEventsMap.keys());
  let sesionesPrimerPaso = 0;

  for (let i = 0; i < steps.length; i++) {
    const stepUrl = steps[i];
    const sesionesQueCumplieron = new Set<string>();

    for (const [sessionId, evts] of sessionEventsMap.entries()) {
      if (!sesionesCandidatas.has(sessionId)) continue;

      const encontro = evts.some((e) => {
        return e.url === stepUrl || (stepUrl !== "/" && e.url.startsWith(stepUrl));
      });

      if (encontro) {
        sesionesQueCumplieron.add(sessionId);
      }
    }

    const cantidadActual = sesionesQueCumplieron.size;

    if (i === 0) {
      sesionesPrimerPaso = cantidadActual;
      funnelSteps.push({
        paso: i + 1,
        nombre: stepUrl,
        sesiones: cantidadActual,
        porcentajeDelInicio: 100,
        tasaCaidaAnterior: 0,
      });
    } else {
      const sesionesAnteriores = funnelSteps[i - 1].sesiones;
      const pctInicio =
        sesionesPrimerPaso > 0 ? Math.round((cantidadActual / sesionesPrimerPaso) * 100) : 0;
      const tasaCaida =
        sesionesAnteriores > 0
          ? Math.round(((sesionesAnteriores - cantidadActual) / sesionesAnteriores) * 100)
          : 0;

      funnelSteps.push({
        paso: i + 1,
        nombre: stepUrl,
        sesiones: cantidadActual,
        porcentajeDelInicio: pctInicio,
        tasaCaidaAnterior: tasaCaida,
      });
    }

    sesionesCandidatas = sesionesQueCumplieron;
  }

  const tasaConversionGlobal =
    funnelSteps.length > 0 && funnelSteps[0].sesiones > 0
      ? Math.round(
          (funnelSteps[funnelSteps.length - 1].sesiones / funnelSteps[0].sesiones) * 100,
        )
      : 0;

  return NextResponse.json({
    steps: funnelSteps,
    tasaConversionGlobal,
    sugerencias: topPages,
    totalSesionesAnalizadas: sessionEventsMap.size,
  });
}

