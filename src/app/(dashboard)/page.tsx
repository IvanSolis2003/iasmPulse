import Image from "next/image";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import prisma from "@/lib/prisma";

export default async function DashboardHome() {
  const totalSites = await prisma.site.count();

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Image
          src="/logo-icon.png"
          alt="iasmtech"
          width={128}
          height={128}
          style={{ width: 44, height: 44 }}
          unoptimized
        />
        <Typography variant="h1" color="primary">
          iasmPulse
        </Typography>
      </Stack>
      <Typography variant="body1" sx={{ opacity: 0.7 }}>
        {totalSites === 0
          ? "Todavía no hay sitios registrados."
          : "Selecciona un sitio en el panel izquierdo para ver sus métricas."}
      </Typography>
    </Stack>
  );
}
