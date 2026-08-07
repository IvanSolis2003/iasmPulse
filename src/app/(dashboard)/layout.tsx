import prisma from "@/lib/prisma";
import DashboardShell from "@/components/DashboardShell";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sites = await prisma.site.findMany({ orderBy: { name: "asc" } });

  return <DashboardShell sites={sites}>{children}</DashboardShell>;
}
