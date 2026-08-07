"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { verdeClaro, verdeOscuro } from "@/theme";

type Pagina = { url: string; count: number };
type Punto = { x: number; y: number };

const ANCHO_CANVAS = 800;
const ALTO_CANVAS = 500;

function hexARgb(hex: string): [number, number, number] {
  const valor = parseInt(hex.slice(1), 16);
  return [(valor >> 16) & 255, (valor >> 8) & 255, valor & 255];
}

function dibujarHeatmap(canvas: HTMLCanvasElement, puntos: Punto[]) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  if (puntos.length === 0) return;

  const acumulador = document.createElement("canvas");
  acumulador.width = w;
  acumulador.height = h;
  const actx = acumulador.getContext("2d");
  if (!actx) return;

  const radio = Math.max(w, h) * 0.045;
  actx.globalCompositeOperation = "lighter";

  for (const punto of puntos) {
    const cx = punto.x * w;
    const cy = punto.y * h;
    const gradiente = actx.createRadialGradient(cx, cy, 0, cx, cy, radio);
    gradiente.addColorStop(0, "rgba(255,255,255,0.35)");
    gradiente.addColorStop(1, "rgba(255,255,255,0)");
    actx.fillStyle = gradiente;
    actx.beginPath();
    actx.arc(cx, cy, radio, 0, Math.PI * 2);
    actx.fill();
  }

  const imagen = actx.getImageData(0, 0, w, h);
  const datos = imagen.data;
  const claro = hexARgb(verdeClaro);
  const oscuro = hexARgb(verdeOscuro);

  for (let i = 0; i < datos.length; i += 4) {
    const densidad = Math.min(datos[i + 3] / 255, 1);
    if (densidad <= 0.02) {
      datos[i + 3] = 0;
      continue;
    }
    datos[i] = claro[0] + (oscuro[0] - claro[0]) * densidad;
    datos[i + 1] = claro[1] + (oscuro[1] - claro[1]) * densidad;
    datos[i + 2] = claro[2] + (oscuro[2] - claro[2]) * densidad;
    datos[i + 3] = Math.min(densidad * 220, 200);
  }

  ctx.putImageData(imagen, 0, 0);
}

export default function HeatmapSitio({ siteId }: { siteId: string }) {
  const [paginas, setPaginas] = useState<Pagina[]>([]);
  const [urlSeleccionada, setUrlSeleccionada] = useState("");
  const [puntos, setPuntos] = useState<Punto[]>([]);
  const [total, setTotal] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch(`/api/sites/${siteId}/heatmap`)
      .then((res) => res.json())
      .then((datos) => {
        setPaginas(datos.pages ?? []);
        if (datos.pages?.length > 0) setUrlSeleccionada(datos.pages[0].url);
      });
  }, [siteId]);

  useEffect(() => {
    if (!urlSeleccionada) return;

    fetch(`/api/sites/${siteId}/heatmap?url=${encodeURIComponent(urlSeleccionada)}`)
      .then((res) => res.json())
      .then((datos) => {
        setPuntos(datos.points ?? []);
        setTotal(datos.total ?? 0);
      });
  }, [siteId, urlSeleccionada]);

  useEffect(() => {
    if (canvasRef.current) {
      dibujarHeatmap(canvasRef.current, puntos);
    }
  }, [puntos]);

  if (paginas.length === 0) {
    return (
      <Typography variant="body2" sx={{ mt: 3, opacity: 0.5 }}>
        Todavía no hay clicks registrados para este sitio.
      </Typography>
    );
  }

  return (
    <Stack spacing={2} sx={{ mt: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { xs: "stretch", sm: "center" } }}
      >
        <Select
          size="small"
          value={urlSeleccionada}
          onChange={(e) => setUrlSeleccionada(e.target.value)}
          sx={{ minWidth: { sm: 240 }, width: { xs: "100%", sm: "auto" } }}
        >
          {paginas.map((pagina) => (
            <MenuItem key={pagina.url} value={pagina.url}>
              {pagina.url} ({pagina.count})
            </MenuItem>
          ))}
        </Select>
        <Typography variant="body2" sx={{ opacity: 0.6 }}>
          {total} clicks
        </Typography>
      </Stack>

      <Paper sx={{ p: 2 }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: `${ANCHO_CANVAS} / ${ALTO_CANVAS}`,
            backgroundColor: "#F5F5F5",
            border: 1,
            borderColor: "divider",
          }}
        >
          <canvas
            ref={canvasRef}
            width={ANCHO_CANVAS}
            height={ALTO_CANVAS}
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        </Box>
      </Paper>
    </Stack>
  );
}
