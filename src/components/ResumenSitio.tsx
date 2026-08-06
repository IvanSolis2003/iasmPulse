"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { verde } from "@/theme";

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

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <Paper sx={{ p: 2.5, flex: 1 }}>
      <Typography variant="caption" sx={{ textTransform: "uppercase", opacity: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: "2rem", fontWeight: 600 }}>
        {value.toLocaleString("es-CL")}
      </Typography>
    </Paper>
  );
}

function BarraRanking({ titulo, datos }: { titulo: string; datos: { nombre: string; visitas: number }[] }) {
  return (
    <Paper sx={{ p: 2.5, flex: 1, minWidth: 0 }}>
      <Typography variant="h3" sx={{ mb: 1.5 }}>
        {titulo}
      </Typography>
      {datos.length === 0 ? (
        <Typography variant="body2" sx={{ opacity: 0.5 }}>
          Sin datos en este rango
        </Typography>
      ) : (
        <BarChart
          layout="horizontal"
          height={Math.max(datos.length * 32, 80)}
          dataset={datos}
          yAxis={[{ dataKey: "nombre", label: undefined }]}
          xAxis={[{ label: undefined }]}
          series={[{ dataKey: "visitas", color: verde, label: "Visitas" }]}
          margin={{ left: 140 }}
          hideLegend
        />
      )}
    </Paper>
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
    <Stack spacing={3} sx={{ mt: 3 }}>
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
      >
        {RANGOS.map((r) => (
          <ToggleButton key={r.valor} value={r.valor} sx={{ borderRadius: 0 }}>
            {r.etiqueta}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Box sx={{ opacity: cargando ? 0.5 : 1, transition: "opacity 0.15s ease" }}>
        {metricas && (
          <Stack spacing={3}>
            <Stack direction="row" spacing={2}>
              <StatTile label="Visitas totales" value={metricas.totalVisitas} />
              <StatTile label="Sesiones únicas" value={metricas.sesionesUnicas} />
            </Stack>

            <Paper sx={{ p: 2.5 }}>
              <Typography variant="h3" sx={{ mb: 1.5 }}>
                Visitas por día
              </Typography>
              <LineChart
                height={260}
                dataset={metricas.porDia}
                xAxis={[{ dataKey: "fecha", scaleType: "point" }]}
                series={[{ dataKey: "visitas", color: verde, showMark: true }]}
                hideLegend
              />
            </Paper>

            <Stack direction="row" spacing={2}>
              <BarraRanking titulo="Top páginas" datos={metricas.topPaginas} />
              <BarraRanking titulo="Top referrers" datos={metricas.topReferrers} />
            </Stack>
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
