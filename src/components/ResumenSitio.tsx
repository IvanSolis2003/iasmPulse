"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import WebAssetOutlinedIcon from "@mui/icons-material/WebAssetOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import TabletMacOutlinedIcon from "@mui/icons-material/TabletMacOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import TouchAppOutlinedIcon from "@mui/icons-material/TouchAppOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import MainCard from "@/components/MainCard";
import KpiCard from "@/components/KpiCard";
import { verde, verdePastel, verdeOscuro, grisBorde } from "@/theme";

type ItemRanking = {
  nombre: string;
  visitas: number;
  porcentaje?: number;
};

type WebVitalsData = {
  avgLcp: number;
  avgCls: number;
  avgTtfb: number;
  avgLoadTime: number;
  lcpStatus: "good" | "needs-improvement" | "poor" | "none";
  clsStatus: "good" | "needs-improvement" | "poor" | "none";
  ttfbStatus: "good" | "needs-improvement" | "poor" | "none";
  totalMuestras: number;
};

type Metricas = {
  totalVisitas: number;
  sesionesUnicas: number;
  totalConversiones?: number;
  rageClicks?: number;
  porDia: { fecha: string; visitas: number }[];
  topPaginas: ItemRanking[];
  topReferrers: ItemRanking[];
  dispositivos?: ItemRanking[];
  navegadores?: ItemRanking[];
  paises?: ItemRanking[];
  campanas?: ItemRanking[];
  eventosPersonalizados?: ItemRanking[];
  enlacesSalientes?: ItemRanking[];
  paginas404?: ItemRanking[];
  scrollDepth?: ItemRanking[];
  webVitals?: WebVitalsData;
};

const RANGOS = [
  { valor: "7d", etiqueta: "7 días" },
  { valor: "30d", etiqueta: "30 días" },
  { valor: "90d", etiqueta: "90 días" },
];

function BarraRanking({ titulo, datos }: { titulo: string; datos: ItemRanking[] }) {
  return (
    <MainCard title={titulo} sx={{ height: "100%" }}>
      {datos.length === 0 ? (
        <Box sx={{ py: 3, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Sin datos registrados en este rango
          </Typography>
        </Box>
      ) : (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <BarChart
            layout="horizontal"
            height={Math.max(datos.length * 36, 120)}
            dataset={datos}
            yAxis={[{ dataKey: "nombre", scaleType: "band", tickLabelStyle: { fontSize: 11 } }]}
            xAxis={[{ tickLabelStyle: { fontSize: 11 } }]}
            series={[{ dataKey: "visitas", color: verde, label: "Visitas" }]}
            margin={{ left: 120, right: 20, top: 10, bottom: 20 }}
            hideLegend
          />
        </Box>
      )}
    </MainCard>
  );
}

function TarjetaDistribucion({
  titulo,
  icono,
  datos,
  emptyText = "Sin datos suficientes",
}: {
  titulo: string;
  icono: React.ReactNode;
  datos?: ItemRanking[];
  emptyText?: string;
}) {
  return (
    <MainCard
      title={
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
          {icono}
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            {titulo}
          </Typography>
        </Stack>
      }
      sx={{ height: "100%" }}
    >
      {!datos || datos.length === 0 ? (
        <Typography variant="body2" sx={{ py: 3, textAlign: "center", color: "text.secondary" }}>
          {emptyText}
        </Typography>
      ) : (
        <Stack spacing={2}>
          {datos.map((item) => {
            const getIcon = () => {
              if (item.nombre === "Desktop") return <ComputerOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />;
              if (item.nombre === "Móvil") return <SmartphoneOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />;
              if (item.nombre === "Tablet") return <TabletMacOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />;
              return null;
            };

            const iconNode = getIcon();

            return (
              <Box key={item.nombre}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", minWidth: 0 }}>
                    {iconNode}
                    <Typography variant="body2" sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.nombre}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", flexShrink: 0, ml: 1 }}>
                    {item.visitas.toLocaleString("es-CL")} ({item.porcentaje ?? 0}%)
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={item.porcentaje ?? 0}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "rgba(0,0,0,0.06)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: verde,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            );
          })}
        </Stack>
      )}
    </MainCard>
  );
}

function TarjetaWebVitals({ vitals }: { vitals?: WebVitalsData }) {
  const getBadge = (status: string, labelBuen: string) => {
    if (status === "good") {
      return (
        <Chip
          label={labelBuen}
          size="small"
          sx={{ backgroundColor: verdePastel, color: verdeOscuro, fontWeight: 700, fontSize: "0.75rem" }}
        />
      );
    }
    if (status === "needs-improvement") {
      return (
        <Chip
          label="Mejorable"
          size="small"
          sx={{ backgroundColor: "#FEF3C7", color: "#D97706", fontWeight: 700, fontSize: "0.75rem" }}
        />
      );
    }
    if (status === "poor") {
      return (
        <Chip
          label="Lento"
          size="small"
          sx={{ backgroundColor: "#FEE2E2", color: "#DC2626", fontWeight: 700, fontSize: "0.75rem" }}
        />
      );
    }
    return (
      <Chip
        label="Pendiente"
        size="small"
        sx={{ backgroundColor: "#F1F5F9", color: "text.secondary", fontWeight: 600, fontSize: "0.75rem" }}
      />
    );
  };

  return (
    <MainCard
      title={
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
          <SpeedOutlinedIcon sx={{ color: verde }} />
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            Rendimiento Web Real (Core Web Vitals)
          </Typography>
        </Stack>
      }
      secondary={
        vitals && vitals.totalMuestras > 0 ? (
          <Chip
            label={`${vitals.totalMuestras} mediciones`}
            size="small"
            sx={{ backgroundColor: "#F1F5F9", color: "text.secondary", fontWeight: 600 }}
          />
        ) : undefined
      }
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box sx={{ p: 2, borderRadius: 2, border: `1px solid ${grisBorde}`, backgroundColor: "#FAFAFA" }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                LCP (Render Visual)
              </Typography>
              {getBadge(vitals?.lcpStatus ?? "none", "🟢 Rápido")}
            </Stack>
            <Typography variant="h3" sx={{ fontWeight: 700, color: "text.primary" }}>
              {vitals && vitals.avgLcp > 0 ? `${(vitals.avgLcp / 1000).toFixed(2)}s` : "En espera"}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Meta recomendada: &lt; 2.5s
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Box sx={{ p: 2, borderRadius: 2, border: `1px solid ${grisBorde}`, backgroundColor: "#FAFAFA" }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                CLS (Estabilidad)
              </Typography>
              {getBadge(vitals?.clsStatus ?? "none", "🟢 Estable")}
            </Stack>
            <Typography variant="h3" sx={{ fontWeight: 700, color: "text.primary" }}>
              {vitals && vitals.avgCls >= 0 ? vitals.avgCls : "En espera"}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Meta recomendada: &lt; 0.1
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Box sx={{ p: 2, borderRadius: 2, border: `1px solid ${grisBorde}`, backgroundColor: "#FAFAFA" }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                TTFB (Respuesta Servidor)
              </Typography>
              {getBadge(vitals?.ttfbStatus ?? "none", "🟢 Óptimo")}
            </Stack>
            <Typography variant="h3" sx={{ fontWeight: 700, color: "text.primary" }}>
              {vitals && vitals.avgTtfb > 0 ? `${vitals.avgTtfb} ms` : "En espera"}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Meta recomendada: &lt; 800ms
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default function ResumenSitio({ siteId }: { siteId: string }) {
  const [rango, setRango] = useState("7d");
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    fetch(`/api/sites/${siteId}/metrics?range=${rango}`)
      .then((res) => res.json())
      .then((datos) => {
        if (!cancelado) {
          setMetricas(datos);
          setCargando(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, [siteId, rango]);

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <CalendarMonthOutlinedIcon fontSize="small" sx={{ color: "text.secondary" }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>
            Rango de tiempo:
          </Typography>
        </Stack>

        <ToggleButtonGroup
          value={rango}
          exclusive
          size="small"
          onChange={(_e, valor) => {
            if (valor) {
              setCargando(true);
              setRango(valor);
            }
          }}
          sx={{
            backgroundColor: "#FFFFFF",
            border: `1px solid ${grisBorde}`,
            borderRadius: 2.5,
            p: 0.25,
            "& .MuiToggleButton-root": {
              border: "none",
              borderRadius: 2,
              px: 1.75,
              py: 0.5,
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "text.secondary",
              "&.Mui-selected": {
                backgroundColor: verdePastel,
                color: verdeOscuro,
              },
            },
          }}
        >
          {RANGOS.map((r) => (
            <ToggleButton key={r.valor} value={r.valor}>
              {r.etiqueta}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      <Box sx={{ opacity: cargando ? 0.6 : 1, transition: "opacity 0.2s ease" }}>
        {metricas ? (
          <Stack spacing={3}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KpiCard
                  variant="dark"
                  icon={<VisibilityOutlinedIcon />}
                  label="Visitas Totales"
                  value={metricas.totalVisitas}
                  sublabel="Pageviews en el período"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KpiCard
                  variant="light"
                  icon={<FingerprintOutlinedIcon />}
                  label="Sesiones Únicas"
                  value={metricas.sesionesUnicas}
                  sublabel="Visitantes únicos contabilizados"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KpiCard
                  variant="light"
                  icon={<TrackChangesOutlinedIcon />}
                  label="Conversiones"
                  value={metricas.totalConversiones ?? 0}
                  sublabel="Acciones clave registradas"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KpiCard
                  variant="light"
                  icon={<TouchAppOutlinedIcon />}
                  label="Clics de Frustración"
                  value={metricas.rageClicks ?? 0}
                  sublabel="Rage clicks detectados"
                />
              </Grid>
            </Grid>

            <MainCard title="Tendencia de Visitas por Día">
              <Box sx={{ width: "100%", overflowX: "auto", minWidth: 0 }}>
                <LineChart
                  height={280}
                  dataset={metricas.porDia}
                  xAxis={[{ dataKey: "fecha", scaleType: "point", tickLabelStyle: { fontSize: 11 } }]}
                  series={[
                    {
                      dataKey: "visitas",
                      color: verde,
                      showMark: true,
                      area: true,
                      baseline: "min",
                    },
                  ]}
                  margin={{ left: 40, right: 20, top: 20, bottom: 30 }}
                  hideLegend
                />
              </Box>
            </MainCard>

            <TarjetaWebVitals vitals={metricas.webVitals} />

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <BarraRanking titulo="Top Páginas más Visitadas" datos={metricas.topPaginas} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <BarraRanking titulo="Top Fuentes de Tráfico (Referrers)" datos={metricas.topReferrers} />
              </Grid>
            </Grid>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TarjetaDistribucion
                  titulo="Países y Ubicación"
                  icono={<PublicOutlinedIcon sx={{ color: verde }} />}
                  datos={metricas.paises}
                  emptyText="Sin datos de ubicación registrados"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TarjetaDistribucion
                  titulo="Profundidad de Lectura (Scroll)"
                  icono={<SwapVertOutlinedIcon sx={{ color: verdeOscuro }} />}
                  datos={metricas.scrollDepth}
                  emptyText="Sin datos de desplazamiento aún"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TarjetaDistribucion
                  titulo="Dispositivos de Acceso"
                  icono={<DevicesOutlinedIcon sx={{ color: verde }} />}
                  datos={metricas.dispositivos}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TarjetaDistribucion
                  titulo="Navegadores Web"
                  icono={<WebAssetOutlinedIcon sx={{ color: verdeOscuro }} />}
                  datos={metricas.navegadores}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TarjetaDistribucion
                  titulo="Enlaces Salientes (WhatsApp / Redes)"
                  icono={<OpenInNewOutlinedIcon sx={{ color: verde }} />}
                  datos={metricas.enlacesSalientes}
                  emptyText="Sin clics en enlaces salientes en este rango"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TarjetaDistribucion
                  titulo="Campañas de Marketing (UTMs)"
                  icono={<CampaignOutlinedIcon sx={{ color: verdeOscuro }} />}
                  datos={metricas.campanas}
                  emptyText="Sin campañas UTM detectadas en este rango"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TarjetaDistribucion
                  titulo="Páginas 404 Detectadas"
                  icono={<ReportProblemOutlinedIcon sx={{ color: "#EF4444" }} />}
                  datos={metricas.paginas404}
                  emptyText="No se detectaron errores 404 (Todo en orden)"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TarjetaDistribucion
                  titulo="Objetivos y Conversiones Registradas"
                  icono={<TrackChangesOutlinedIcon sx={{ color: verde }} />}
                  datos={metricas.eventosPersonalizados}
                  emptyText="Sin eventos de conversión registrados"
                />
              </Grid>
            </Grid>
          </Stack>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        )}
      </Box>
    </Stack>
  );
}
