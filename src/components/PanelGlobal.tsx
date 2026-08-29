"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import TouchAppOutlinedIcon from "@mui/icons-material/TouchAppOutlined";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import MainCard from "@/components/MainCard";
import KpiCard from "@/components/KpiCard";
import LivePulseBadge from "@/components/LivePulseBadge";
import { verde, verdePastel, verdeOscuro, grisBorde } from "@/theme";

type SiteRendimiento = {
  id: string;
  name: string;
  domain: string;
  color: string;
  visitas: number;
  sesiones: number;
  clicks: number;
  participacion: number;
};

type GlobalMetrics = {
  totalVisitas: number;
  sesionesUnicas: number;
  totalClicks: number;
  activosAhora: number;
  porDia: { fecha: string; total: number; [key: string]: string | number }[];
  sites: SiteRendimiento[];
  topPaginas: { nombre: string; visitas: number }[];
  topReferrers: { nombre: string; visitas: number }[];
  paises?: { nombre: string; visitas: number; porcentaje?: number }[];
};

const RANGOS = [
  { valor: "7d", etiqueta: "7 días" },
  { valor: "30d", etiqueta: "30 días" },
  { valor: "90d", etiqueta: "90 días" },
];

export default function PanelGlobal() {
  const [rango, setRango] = useState("7d");
  const [metricas, setMetricas] = useState<GlobalMetrics | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = (r: string) => {
    fetch(`/api/metrics/global?range=${r}`)
      .then((res) => res.json())
      .then((datos) => {
        setMetricas(datos);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarDatos(rango);

    const intervalo = setInterval(() => {
      cargarDatos(rango);
    }, 15000);

    return () => clearInterval(intervalo);
  }, [rango]);

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
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          {metricas && <LivePulseBadge count={metricas.activosAhora} />}
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <CalendarMonthOutlinedIcon fontSize="small" sx={{ color: "text.secondary", display: { xs: "none", sm: "block" } }} />
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
      </Stack>

      <Box sx={{ opacity: cargando ? 0.6 : 1, transition: "opacity 0.2s ease" }}>
        {metricas ? (
          <Stack spacing={3}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KpiCard
                  variant="dark"
                  icon={<SensorsOutlinedIcon />}
                  label="Visitantes en Vivo"
                  value={metricas.activosAhora}
                  sublabel="Sesiones activas en últimos 5 min"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KpiCard
                  variant="light"
                  icon={<VisibilityOutlinedIcon />}
                  label="Visitas Totales"
                  value={metricas.totalVisitas}
                  sublabel="Pageviews en todo el ecosistema"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KpiCard
                  variant="light"
                  icon={<FingerprintOutlinedIcon />}
                  label="Sesiones Únicas"
                  value={metricas.sesionesUnicas}
                  sublabel="Usuarios únicos consolidados"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <KpiCard
                  variant="light"
                  icon={<TouchAppOutlinedIcon />}
                  label="Clics Totales"
                  value={metricas.totalClicks}
                  sublabel="Puntos de interacción registrados"
                />
              </Grid>
            </Grid>

            <MainCard
              title="Comparativa de Tráfico por Aplicación"
              secondary={
                <Chip
                  label={`${metricas.sites.length} aplicaciones`}
                  size="small"
                  sx={{ backgroundColor: verdePastel, color: verdeOscuro, fontWeight: 700 }}
                />
              }
            >
              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <LineChart
                  height={320}
                  dataset={metricas.porDia}
                  xAxis={[{ dataKey: "fecha", scaleType: "point", tickLabelStyle: { fontSize: 11 } }]}
                  series={[
                    {
                      dataKey: "total",
                      label: "Total Combinado",
                      color: verde,
                      showMark: true,
                      area: true,
                    },
                    ...metricas.sites.map((s) => ({
                      dataKey: s.id,
                      label: s.name,
                      color: s.color,
                      showMark: false,
                    })),
                  ]}
                  margin={{ left: 40, right: 20, top: 30, bottom: 40 }}
                />
              </Box>
            </MainCard>

            <MainCard title="Rendimiento por Aplicación">
              {metricas.sites.length === 0 ? (
                <Typography variant="body2" sx={{ py: 3, textAlign: "center", color: "text.secondary" }}>
                  No hay sitios registrados todavía.
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Aplicación</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Dominio</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Visitas</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Sesiones</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Clics</TableCell>
                        <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>% Tráfico</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>Acción</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {metricas.sites.map((site) => (
                        <TableRow key={site.id} hover>
                          <TableCell>
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: 1,
                                  backgroundColor: site.color,
                                }}
                              />
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {site.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" sx={{ color: "text.secondary", fontFamily: "monospace" }}>
                              {site.domain}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {site.visitas.toLocaleString("es-CL")}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {site.sesiones.toLocaleString("es-CL")}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {site.clicks.toLocaleString("es-CL")}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack spacing={0.5}>
                              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                  {site.participacion}%
                                </Typography>
                              </Stack>
                              <LinearProgress
                                variant="determinate"
                                value={site.participacion}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  backgroundColor: "rgba(0,0,0,0.06)",
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: site.color,
                                    borderRadius: 3,
                                  },
                                }}
                              />
                            </Stack>
                          </TableCell>
                          <TableCell align="center">
                            <Link href={`/site/${site.id}`} style={{ textDecoration: "none" }}>
                              <Button
                                size="small"
                                variant="outlined"
                                endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />}
                                sx={{ py: 0.5, px: 1.5, fontSize: "0.75rem" }}
                              >
                                Ver
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </MainCard>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 4 }}>
                <MainCard
                  title={
                    <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                      <PublicOutlinedIcon sx={{ color: verde }} />
                      <Typography variant="h3" sx={{ fontWeight: 600 }}>
                        Países del Ecosistema
                      </Typography>
                    </Stack>
                  }
                  sx={{ height: "100%" }}
                >
                  {!metricas.paises || metricas.paises.length === 0 ? (
                    <Typography variant="body2" sx={{ py: 3, textAlign: "center", color: "text.secondary" }}>
                      Sin datos de geolocalización aún
                    </Typography>
                  ) : (
                    <Stack spacing={1.75}>
                      {metricas.paises.map((item) => (
                        <Box key={item.nombre}>
                          <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.nombre}
                            </Typography>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                              {item.visitas} ({item.porcentaje ?? 0}%)
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={item.porcentaje ?? 0}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: "rgba(0,0,0,0.06)",
                              "& .MuiLinearProgress-bar": { backgroundColor: verde, borderRadius: 3 },
                            }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  )}
                </MainCard>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <MainCard title="Top Páginas Globales">
                  {metricas.topPaginas.length === 0 ? (
                    <Typography variant="body2" sx={{ py: 3, textAlign: "center", color: "text.secondary" }}>
                      Sin datos en este rango
                    </Typography>
                  ) : (
                    <Box sx={{ width: "100%", overflowX: "auto" }}>
                      <BarChart
                        layout="horizontal"
                        height={Math.max(metricas.topPaginas.length * 36, 120)}
                        dataset={metricas.topPaginas}
                        yAxis={[{ dataKey: "nombre", scaleType: "band", tickLabelStyle: { fontSize: 11 } }]}
                        xAxis={[{ tickLabelStyle: { fontSize: 11 } }]}
                        series={[{ dataKey: "visitas", color: verde, label: "Visitas" }]}
                        margin={{ left: 110, right: 15, top: 10, bottom: 20 }}
                        hideLegend
                      />
                    </Box>
                  )}
                </MainCard>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <MainCard title="Top Fuentes de Tráfico">
                  {metricas.topReferrers.length === 0 ? (
                    <Typography variant="body2" sx={{ py: 3, textAlign: "center", color: "text.secondary" }}>
                      Sin datos en este rango
                    </Typography>
                  ) : (
                    <Box sx={{ width: "100%", overflowX: "auto" }}>
                      <BarChart
                        layout="horizontal"
                        height={Math.max(metricas.topReferrers.length * 36, 120)}
                        dataset={metricas.topReferrers}
                        yAxis={[{ dataKey: "nombre", scaleType: "band", tickLabelStyle: { fontSize: 11 } }]}
                        xAxis={[{ tickLabelStyle: { fontSize: 11 } }]}
                        series={[{ dataKey: "visitas", color: verdeOscuro, label: "Visitas" }]}
                        margin={{ left: 110, right: 15, top: 10, bottom: 20 }}
                        hideLegend
                      />
                    </Box>
                  )}
                </MainCard>
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
