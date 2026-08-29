"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import MainCard from "@/components/MainCard";
import KpiCard from "@/components/KpiCard";
import { verde, verdePastel, verdeOscuro, grisBorde } from "@/theme";

type Metricas = {
  totalVisitas: number;
  sesionesUnicas: number;
  porDia: { fecha: string; visitas: number }[];
  topPaginas: { nombre: string; visitas: number }[];
  topReferrers: { nombre: string; visitas: number }[];
};

const RANGOS = [
  { valor: "7d", etiqueta: "7 días" },
  { valor: "30d", etiqueta: "30 días" },
  { valor: "90d", etiqueta: "90 días" },
];

function BarraRanking({ titulo, datos }: { titulo: string; datos: { nombre: string; visitas: number }[] }) {
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
              <Grid size={{ xs: 12, sm: 6 }}>
                <KpiCard
                  variant="dark"
                  icon={<VisibilityOutlinedIcon />}
                  label="Visitas Totales"
                  value={metricas.totalVisitas}
                  sublabel="Pageviews en el período seleccionado"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <KpiCard
                  variant="light"
                  icon={<FingerprintOutlinedIcon />}
                  label="Sesiones Únicas"
                  value={metricas.sesionesUnicas}
                  sublabel="Visitantes únicos contabilizados"
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
