import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import prisma from "@/lib/prisma";

export default async function DashboardHome() {
  const totalSites = await prisma.site.count();

  return (
    <Stack spacing={1.5}>
      <Typography variant="h1" color="primary">
        iasmPulse
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.7 }}>
        {totalSites === 0
          ? "Todavía no hay sitios registrados."
          : "Selecciona un sitio en el panel izquierdo para ver sus métricas."}
      </Typography>
    </Stack>
  );
}
