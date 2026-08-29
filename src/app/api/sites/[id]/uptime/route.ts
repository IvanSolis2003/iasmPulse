import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const site = await prisma.site.findUnique({ where: { id } });
  if (!site) {
    return NextResponse.json({ error: "Sitio no encontrado" }, { status: 404 });
  }

  const cleanDomain = site.domain.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const targetUrl = `https://${cleanDomain}`;

  const inicio = performance.now();
  let online = false;
  let statusCode = 0;
  let errorMsg: string | null = null;
  let latenciaMs: number | null = null;

  try {
    const respuesta = await fetch(targetUrl, {
      method: "HEAD",
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent": "iasmPulse-UptimeBot/1.0 (+https://pulse.iasmtech.com)",
      },
    });

    const fin = performance.now();
    latenciaMs = Math.round(fin - inicio);
    statusCode = respuesta.status;
    online = respuesta.status >= 200 && respuesta.status < 400;
  } catch (error: unknown) {
    const fin = performance.now();
    latenciaMs = Math.round(fin - inicio);

    if (error instanceof Error && error.name === "TimeoutError") {
      statusCode = 504;
      errorMsg = "Tiempo de espera agotado (Timeout > 8s)";
    } else {
      statusCode = 500;
      errorMsg = error instanceof Error ? error.message : "Error al conectar con el servidor";
    }
  }

  return NextResponse.json({
    online,
    statusCode,
    latencyMs: latenciaMs,
    error: errorMsg,
    lastChecked: new Date().toISOString(),
    domain: site.domain,
    targetUrl,
  });
}

