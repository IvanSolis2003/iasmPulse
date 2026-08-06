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

  if (!url) {
    const agrupado = await prisma.clickEvent.groupBy({
      by: ["url"],
      where: { siteId: id },
      _count: { _all: true },
      orderBy: { _count: { url: "desc" } },
    });

    return NextResponse.json({
      pages: agrupado.map((g) => ({ url: g.url, count: g._count._all })),
    });
  }

  const clicks = await prisma.clickEvent.findMany({
    where: { siteId: id, url },
    select: { x: true, y: true },
  });

  return NextResponse.json({
    url,
    total: clicks.length,
    points: clicks,
  });
}
