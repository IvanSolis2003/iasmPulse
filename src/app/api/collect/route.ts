import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

type EventoPayload = {
  type: "pageview" | "custom";
  url: string;
  referrer?: string;
  metadata?: Prisma.InputJsonValue;
};

type ClickPayload = {
  type: "click";
  url: string;
  x: number;
  y: number;
  viewportWidth: number;
  viewportHeight: number;
};

type CollectPayload = {
  site: string;
  sessionId: string;
  events: (EventoPayload | ClickPayload)[];
};

function esClick(e: unknown): e is ClickPayload {
  if (typeof e !== "object" || e === null) return false;
  const c = e as Record<string, unknown>;
  return (
    c.type === "click" &&
    typeof c.url === "string" &&
    typeof c.x === "number" &&
    c.x >= 0 &&
    c.x <= 1 &&
    typeof c.y === "number" &&
    c.y >= 0 &&
    c.y <= 1 &&
    typeof c.viewportWidth === "number" &&
    typeof c.viewportHeight === "number"
  );
}

function esEvento(e: unknown): e is EventoPayload {
  if (typeof e !== "object" || e === null) return false;
  const v = e as Record<string, unknown>;
  return (
    (v.type === "pageview" || v.type === "custom") &&
    typeof v.url === "string" &&
    (v.referrer === undefined || typeof v.referrer === "string")
  );
}

function extraerHost(valor: string | null): string | null {
  if (!valor) return null;
  try {
    return new URL(valor).host;
  } catch {
    return null;
  }
}

function obtenerIpCliente(request: NextRequest): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}

function esIpExcluida(ip: string | null): boolean {
  if (!ip) return false;
  const excluidas = (process.env.EXCLUDED_IPS ?? "")
    .split(",")
    .map((valor) => valor.trim())
    .filter(Boolean);
  return excluidas.includes(ip);
}

function validarPayload(body: unknown): CollectPayload | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  if (typeof b.site !== "string" || b.site.length === 0) return null;
  if (typeof b.sessionId !== "string" || b.sessionId.length === 0) return null;
  if (!Array.isArray(b.events) || b.events.length === 0) return null;

  for (const e of b.events) {
    if (!esClick(e) && !esEvento(e)) return null;
  }

  return b as unknown as CollectPayload;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  if (esIpExcluida(obtenerIpCliente(request))) {
    return NextResponse.json({ ok: true, excluido: true }, { status: 202, headers: corsHeaders });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido" },
      { status: 400, headers: corsHeaders },
    );
  }

  const payload = validarPayload(body);

  if (!payload) {
    return NextResponse.json(
      { error: "Payload inválido" },
      { status: 400, headers: corsHeaders },
    );
  }

  const site = await prisma.site.findUnique({
    where: { domain: payload.site },
  });

  if (!site) {
    return NextResponse.json(
      { error: "Sitio no registrado" },
      { status: 404, headers: corsHeaders },
    );
  }

  const hostOrigen =
    extraerHost(request.headers.get("origin")) ??
    extraerHost(request.headers.get("referer"));

  if (hostOrigen !== site.domain) {
    return NextResponse.json(
      { error: "El origen de la solicitud no coincide con el sitio" },
      { status: 403, headers: corsHeaders },
    );
  }

  const eventos = payload.events.filter(esEvento);
  const clicks = payload.events.filter(esClick);

  await Promise.all([
    eventos.length > 0
      ? prisma.event.createMany({
          data: eventos.map((e) => ({
            siteId: site.id,
            sessionId: payload.sessionId,
            type: e.type,
            url: e.url,
            referrer: e.referrer,
            metadata: e.metadata,
          })),
        })
      : Promise.resolve(),
    clicks.length > 0
      ? prisma.clickEvent.createMany({
          data: clicks.map((c) => ({
            siteId: site.id,
            url: c.url,
            x: c.x,
            y: c.y,
            viewportWidth: c.viewportWidth,
            viewportHeight: c.viewportHeight,
          })),
        })
      : Promise.resolve(),
  ]);

  return NextResponse.json(
    { ok: true, events: eventos.length, clicks: clicks.length },
    { status: 202, headers: corsHeaders },
  );
}
