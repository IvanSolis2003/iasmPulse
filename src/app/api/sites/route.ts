import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

const COLOR_HEX = /^#[0-9a-fA-F]{6}$/;

type CrearSitePayload = {
  name: string;
  domain: string;
  color?: string;
};

function validarPayload(body: unknown): CrearSitePayload | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  if (typeof b.name !== "string" || b.name.trim().length === 0) return null;
  if (typeof b.domain !== "string" || b.domain.trim().length === 0) return null;
  if (b.color !== undefined && (typeof b.color !== "string" || !COLOR_HEX.test(b.color))) {
    return null;
  }

  return { name: b.name.trim(), domain: b.domain.trim(), color: b.color as string | undefined };
}

export async function GET() {
  const sites = await prisma.site.findMany({
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(sites);
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const payload = validarPayload(body);

  if (!payload) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  try {
    const site = await prisma.site.create({ data: payload });
    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ya existe un sitio con ese dominio" },
        { status: 409 },
      );
    }

    throw error;
  }
}
