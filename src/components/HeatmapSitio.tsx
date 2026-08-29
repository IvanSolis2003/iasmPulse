"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import TouchAppOutlinedIcon from "@mui/icons-material/TouchAppOutlined";
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import MainCard from "@/components/MainCard";
import { verde, verdeClaro, verdeOscuro, verdePastel, grisBorde } from "@/theme";

type Pagina = { url: string; count: number };
type Punto = { x: number; y: number };

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
  const [dispositivo, setDispositivo] = useState<"all" | "desktop" | "mobile">("all");
  const [puntos, setPuntos] = useState<Punto[]>([]);
  const [total, setTotal] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const esMovil = dispositivo === "mobile";
  const anchoCanvas = esMovil ? 375 : 800;
  const altoCanvas = esMovil ? 667 : 500;

  useEffect(() => {
    fetch(`/api/sites/${siteId}/heatmap?device=${dispositivo}`)
      .then((res) => res.json())
      .then((datos) => {
        setPaginas(datos.pages ?? []);
        if (datos.pages?.length > 0 && !urlSeleccionada) {
          setUrlSeleccionada(datos.pages[0].url);
        }
      });
  }, [siteId, dispositivo, urlSeleccionada]);

  useEffect(() => {
    if (!urlSeleccionada) return;

    fetch(`/api/sites/${siteId}/heatmap?url=${encodeURIComponent(urlSeleccionada)}&device=${dispositivo}`)
      .then((res) => res.json())
      .then((datos) => {
        setPuntos(datos.points ?? []);
        setTotal(datos.total ?? 0);
      });
  }, [siteId, urlSeleccionada, dispositivo]);

  useEffect(() => {
    if (canvasRef.current) {
      dibujarHeatmap(canvasRef.current, puntos);
    }
  }, [puntos, anchoCanvas, altoCanvas]);

  if (paginas.length === 0 && dispositivo === "all") {
    return (
      <MainCard>
        <Box sx={{ py: 6, textAlign: "center" }}>
          <TouchAppOutlinedIcon sx={{ fontSize: 48, color: "text.secondary", opacity: 0.4, mb: 1 }} />
          <Typography variant="h3" sx={{ color: "text.primary", mb: 0.5 }}>
            Sin clics registrados
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Todavía no se han recopilado puntos de interacción en este sitio.
          </Typography>
        </Box>
      </MainCard>
    );
  }

  return (
    <MainCard
      title="Mapa de Calor e Interacción"
      secondary={
        <Chip
          label={`${total} clics en esta vista`}
          size="small"
          sx={{
            backgroundColor: verdePastel,
            color: verdeOscuro,
            fontWeight: 700,
          }}
        />
      }
    >
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <FormControl size="small" sx={{ minWidth: { sm: 280 } }}>
            <InputLabel id="select-pagina-label">Página a inspeccionar</InputLabel>
            <Select
              labelId="select-pagina-label"
              label="Página a inspeccionar"
              value={urlSeleccionada}
              onChange={(e) => setUrlSeleccionada(e.target.value)}
            >
              {paginas.map((pagina) => (
                <MenuItem key={pagina.url} value={pagina.url}>
                  {pagina.url} ({pagina.count} clics)
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={dispositivo}
            exclusive
            size="small"
            onChange={(_e, valor) => {
              if (valor) setDispositivo(valor);
            }}
            sx={{
              backgroundColor: "#FFFFFF",
              border: `1px solid ${grisBorde}`,
              borderRadius: 2.5,
              p: 0.25,
              "& .MuiToggleButton-root": {
                border: "none",
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "text.secondary",
                "&.Mui-selected": {
                  backgroundColor: verdePastel,
                  color: verdeOscuro,
                },
              },
            }}
          >
            <ToggleButton value="all">
              <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                <DevicesOutlinedIcon sx={{ fontSize: 16 }} />
                <span>Todos</span>
              </Stack>
            </ToggleButton>
            <ToggleButton value="desktop">
              <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                <ComputerOutlinedIcon sx={{ fontSize: 16 }} />
                <span>Desktop</span>
              </Stack>
            </ToggleButton>
            <ToggleButton value="mobile">
              <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                <SmartphoneOutlinedIcon sx={{ fontSize: 16 }} />
                <span>Móvil</span>
              </Stack>
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: esMovil ? 375 : 800,
              aspectRatio: `${anchoCanvas} / ${altoCanvas}`,
              backgroundColor: "#F1F5F9",
              borderRadius: 2.5,
              border: `1px solid ${grisBorde}`,
              overflow: "hidden",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.04)",
              transition: "max-width 0.3s ease",
            }}
          >
            <canvas
              ref={canvasRef}
              width={anchoCanvas}
              height={altoCanvas}
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </Box>
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "center" }}>
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: verde }} />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Muestra la densidad de clics acumulada normalizada por el tamaño de pantalla del dispositivo.
          </Typography>
        </Stack>
      </Stack>
    </MainCard>
  );
}
