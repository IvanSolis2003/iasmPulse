import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const IP_PRIVADA_REGEX =
  /^(localhost|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+|169\.254\.\d+\.\d+|0\.0\.0\.0|::1)$/i;

function esDominioSeguro(dominio: string): boolean {
  if (!dominio || dominio.length > 253) return false;
  if (IP_PRIVADA_REGEX.test(dominio)) return false;
  return /^[a-zA-Z0-9][a-zA-Z0-9-._]+[a-zA-Z0-9]$/.test(dominio);
}

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

  if (!esDominioSeguro(cleanDomain)) {
    return NextResponse.json(
      {
        online: false,
        statusCode: 400,
        latencyMs: null,
        error: "Dominio no válido o restringido",
        lastChecked: new Date().toISOString(),
        domain: site.domain,
        targetUrl: `https://${cleanDomain}`,
      },
      { status: 400 },
    );
  }

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
      errorMsg = "No se pudo establecer conexión segura con el servidor";
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
