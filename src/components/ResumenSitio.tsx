"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
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

type Metricas = {
  totalVisitas: number;
  sesionesUnicas: number;
  totalConversiones?: number;
  porDia: { fecha: string; visitas: number }[];
  topPaginas: ItemRanking[];
  topReferrers: ItemRanking[];
  dispositivos?: ItemRanking[];
  navegadores?: ItemRanking[];
  campanas?: ItemRanking[];
  eventosPersonalizados?: ItemRanking[];
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
              return <WebAssetOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />;
            };

            return (
              <Box key={item.nombre}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    {getIcon()}
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.nombre}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
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
              <Grid size={{ xs: 12, sm: 4 }}>
                <KpiCard
                  variant="dark"
                  icon={<VisibilityOutlinedIcon />}
                  label="Visitas Totales"
                  value={metricas.totalVisitas}
                  sublabel="Pageviews en el período"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <KpiCard
                  variant="light"
                  icon={<FingerprintOutlinedIcon />}
                  label="Sesiones Únicas"
                  value={metricas.sesionesUnicas}
                  sublabel="Visitantes únicos contabilizados"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <KpiCard
                  variant="light"
                  icon={<TrackChangesOutlinedIcon />}
                  label="Conversiones & Eventos"
                  value={metricas.totalConversiones ?? 0}
                  sublabel="Acciones clave registradas"
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
                  titulo="Campañas de Marketing (UTMs)"
                  icono={<CampaignOutlinedIcon sx={{ color: verde }} />}
                  datos={metricas.campanas}
                  emptyText="Sin campañas UTM detectadas en este rango"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TarjetaDistribucion
                  titulo="Objetivos y Conversiones"
                  icono={<TrackChangesOutlinedIcon sx={{ color: verdeOscuro }} />}
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
