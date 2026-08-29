import Image from "next/image";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MainCard from "@/components/MainCard";
import PanelGlobal from "@/components/PanelGlobal";
import { verde, verdeOscuro } from "@/theme";

export default function DashboardHome() {
  return (
    <Stack spacing={3}>
      <MainCard
        sx={{
          background: `linear-gradient(135deg, ${verdeOscuro} 0%, ${verde} 100%)`,
          color: "#FFFFFF",
          border: "none",
          position: "relative",
          overflow: "hidden",
          p: { xs: 1, sm: 1.5 },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2.5}
          sx={{ alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between" }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                p: 1,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Image
                src="/logo-icon.png"
                alt="iasmtech"
                width={44}
                height={44}
                style={{ width: 44, height: 44, borderRadius: 8 }}
                unoptimized
              />
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.75)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                }}
              >
                Panel de Analítica y Monitoreo Global
              </Typography>
              <Typography variant="h1" sx={{ color: "#FFFFFF", fontSize: { xs: "1.375rem", sm: "1.75rem" } }}>
                Ecosistema iasmtech
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.85)", mt: 0.25 }}>
                Métricas consolidadas de tráfico, visitantes en tiempo real y rendimiento de tus aplicaciones.
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </MainCard>

      <PanelGlobal />
    </Stack>
  );
}
