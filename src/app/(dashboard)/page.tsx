import Image from "next/image";
import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import LanguageIcon from "@mui/icons-material/Language";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import TouchAppOutlinedIcon from "@mui/icons-material/TouchAppOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import prisma from "@/lib/prisma";
import MainCard from "@/components/MainCard";
import KpiCard from "@/components/KpiCard";
import { verde, verdePastel, verdeOscuro, grisBorde } from "@/theme";

export default async function DashboardHome() {
  const [sites, totalEvents, totalClicks] = await Promise.all([
    prisma.site.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { events: true, clicks: true },
        },
      },
    }),
    prisma.event.count({ where: { type: "pageview" } }),
    prisma.clickEvent.count(),
  ]);

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
              }}
            >
              <Image
                src="/logo-icon.png"
                alt="iasmtech"
                width={48}
                height={48}
                style={{ width: 48, height: 48, borderRadius: 8 }}
                unoptimized
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.75)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                Panel de Analítica y Monitoreo
              </Typography>
              <Typography variant="h1" sx={{ color: "#FFFFFF", fontSize: { xs: "1.5rem", sm: "1.75rem" } }}>
                Bienvenido a iasmPulse
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.85)", mt: 0.5 }}>
                Monitoreo centralizado de visitas, sesiones y mapas de calor para tus aplicaciones.
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </MainCard>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <KpiCard
            variant="dark"
            icon={<LanguageIcon />}
            label="Sitios Monitoreados"
            value={sites.length}
            sublabel="Apps conectadas"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <KpiCard
            variant="light"
            icon={<VisibilityOutlinedIcon />}
            label="Visitas Totales"
            value={totalEvents}
            sublabel="Pageviews registrados"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <KpiCard
            variant="light"
            icon={<TouchAppOutlinedIcon />}
            label="Clics Registrados"
            value={totalClicks}
            sublabel="Puntos de calor capturados"
          />
        </Grid>
      </Grid>

      <MainCard title="Tus Sitios Web" secondary={<Chip label={`${sites.length} sitios`} size="small" sx={{ backgroundColor: verdePastel, color: verdeOscuro, fontWeight: 700 }} />}>
        {sites.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Todavía no hay sitios registrados en la plataforma.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {sites.map((site) => {
              const colorSitio = site.color || verde;
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={site.id}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2.5,
                      border: `1px solid ${grisBorde}`,
                      backgroundColor: "background.paper",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        borderColor: colorSitio,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              borderRadius: 1,
                              backgroundColor: colorSitio,
                            }}
                          />
                          <Typography variant="h3" sx={{ fontWeight: 700 }}>
                            {site.name}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8125rem", wordBreak: "break-all" }}>
                        {site.domain}
                      </Typography>

                      <Stack direction="row" spacing={2} sx={{ pt: 1, borderTop: `1px solid ${grisBorde}`, justifyContent: "space-between", alignItems: "center" }}>
                        <Stack direction="row" spacing={1.5}>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {site._count.events} <span style={{ opacity: 0.6 }}>visitas</span>
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {site._count.clicks} <span style={{ opacity: 0.6 }}>clics</span>
                          </Typography>
                        </Stack>

                        <Link href={`/site/${site.id}`} style={{ textDecoration: "none" }}>
                          <Button
                            size="small"
                            variant="outlined"
                            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />}
                            sx={{ fontSize: "0.75rem", py: 0.5, px: 1.25 }}
                          >
                            Ver
                          </Button>
                        </Link>
                      </Stack>
                    </Stack>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </MainCard>
    </Stack>
  );
}
