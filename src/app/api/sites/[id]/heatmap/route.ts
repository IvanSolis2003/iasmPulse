import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const site = await prisma.site.findUnique({ where: { id } });
  if (!site) {
    return NextResponse.json({ error: "Sitio no encontrado" }, { status: 404 });
  }

  const url = request.nextUrl.searchParams.get("url");
  const device = request.nextUrl.searchParams.get("device") || "all";

  const deviceFilter =
    device === "mobile"
      ? { viewportWidth: { lt: 768 } }
      : device === "desktop"
      ? { viewportWidth: { gte: 768 } }
      : {};

  if (!url) {
    const agrupado = await prisma.clickEvent.groupBy({
      by: ["url"],
      where: { siteId: id, ...deviceFilter },
      _count: { _all: true },
      orderBy: { _count: { url: "desc" } },
    });

    return NextResponse.json({
      pages: agrupado.map((g) => ({ url: g.url, count: g._count._all })),
      device,
    });
  }

  const clicks = await prisma.clickEvent.findMany({
    where: { siteId: id, url, ...deviceFilter },
    select: { x: true, y: true },
  });

  return NextResponse.json({
    url,
    total: clicks.length,
    points: clicks,
    device,
  });
}
