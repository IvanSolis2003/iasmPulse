"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import MainCard from "@/components/MainCard";
import KpiCard from "@/components/KpiCard";
import { verde, verdePastel, verdeOscuro, grisBorde } from "@/theme";

type FunnelStep = {
  paso: number;
  nombre: string;
  sesiones: number;
  porcentajeDelInicio: number;
  tasaCaidaAnterior: number;
};

type FunnelData = {
  steps: FunnelStep[];
  tasaConversionGlobal: number;
  sugerencias: string[];
  totalSesionesAnalizadas: number;
};

export default function FunnelViewer({ siteId }: { siteId: string }) {
  const [rango, setRango] = useState("30d");
  const [pasos, setPasos] = useState<string[]>(["/", "/onboarding", "/registro"]);
  const [nuevoPaso, setNuevoPaso] = useState("");
  const [data, setData] = useState<FunnelData | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;
    const stepsParam = pasos.join(",");

    fetch(`/api/sites/${siteId}/funnel?range=${rango}&steps=${encodeURIComponent(stepsParam)}`)
      .then((res) => res.json())
      .then((resultado: FunnelData) => {
        if (!cancelado) {
          setData(resultado);
          setCargando(false);
        }
      })
      .catch(() => {
        if (!cancelado) {
          setCargando(false);
        }
      });

    return () => {
      cancelado = true;
    };
  }, [siteId, rango, pasos]);

  const agregarPaso = () => {
    if (!nuevoPaso.trim()) return;
    const path = nuevoPaso.trim().startsWith("/") ? nuevoPaso.trim() : `/${nuevoPaso.trim()}`;
    setCargando(true);
    setPasos([...pasos, path]);
    setNuevoPaso("");
  };

  const eliminarPaso = (indice: number) => {
    if (pasos.length <= 1) return;
    setCargando(true);
    setPasos(pasos.filter((_, i) => i !== indice));
  };

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
            Período de análisis:
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
          <ToggleButton value="7d">7 días</ToggleButton>
          <ToggleButton value="30d">30 días</ToggleButton>
          <ToggleButton value="90d">90 días</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <KpiCard
            variant="dark"
            icon={<CheckCircleOutlineRoundedIcon />}
            label="Tasa de Conversión Global"
            value={`${data?.tasaConversionGlobal ?? 0}%`}
            sublabel="Sesiones que completaron el embudo"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <KpiCard
            variant="light"
            icon={<FilterAltOutlinedIcon />}
            label="Sesiones Analizadas"
            value={(data?.totalSesionesAnalizadas ?? 0).toLocaleString("es-CL")}
            sublabel="Visitantes únicos en el período"
          />
        </Grid>
      </Grid>

      <MainCard
        title="Configuración de Pasos del Embudo"
        secondary={
          <Chip
            label={`${pasos.length} etapas`}
            size="small"
            sx={{ backgroundColor: verdePastel, color: verdeOscuro, fontWeight: 700 }}
          />
        }
      >
        <Stack spacing={2.5}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Configura la secuencia de páginas para medir cuántos usuarios avanzan o en cuál etapa se caen.
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {pasos.map((p, index) => (
              <Chip
                key={`${p}-${index}`}
                label={`Paso ${index + 1}: ${p}`}
                onDelete={pasos.length > 1 ? () => eliminarPaso(index) : undefined}
                deleteIcon={<DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />}
                sx={{
                  backgroundColor: "#F1F5F9",
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  py: 2,
                }}
              />
            ))}
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Ej: /checkout o /contacto"
              value={nuevoPaso}
              onChange={(e) => setNuevoPaso(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") agregarPaso();
              }}
              sx={{ maxWidth: { xs: "100%", sm: 300 } }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddRoundedIcon />}
              onClick={agregarPaso}
              sx={{ py: 0.8, px: 2 }}
            >
              Agregar Paso
            </Button>
          </Stack>
        </Stack>
      </MainCard>

      <MainCard title="Visualización del Embudo de Conversión">
        {cargando ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : !data || data.steps.length === 0 ? (
          <Typography variant="body2" sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
            Sin datos suficientes para calcular el embudo en este rango.
          </Typography>
        ) : (
          <Stack spacing={3} sx={{ py: 2 }}>
            {data.steps.map((step, idx) => (
              <Box key={`${step.nombre}-${idx}`}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    border: `1px solid ${grisBorde}`,
                    backgroundColor: idx === 0 ? "#F8FAFC" : "#FFFFFF",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{
                      alignItems: { xs: "flex-start", sm: "center" },
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          backgroundColor: idx === data.steps.length - 1 ? verde : verdePastel,
                          color: idx === data.steps.length - 1 ? "#FFFFFF" : verdeOscuro,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.8125rem",
                        }}
                      >
                        {step.paso}
                      </Box>
                      <Typography variant="h3" sx={{ fontWeight: 700, fontSize: "1rem" }}>
                        {step.nombre}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                        {step.sesiones.toLocaleString("es-CL")} visitantes
                      </Typography>
                      <Chip
                        label={`${step.porcentajeDelInicio}% retenido`}
                        size="small"
                        sx={{
                          backgroundColor: verdePastel,
                          color: verdeOscuro,
                          fontWeight: 700,
                        }}
                      />
                    </Stack>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={step.porcentajeDelInicio}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "rgba(0,0,0,0.06)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: idx === data.steps.length - 1 ? verdeOscuro : verde,
                        borderRadius: 5,
                      },
                    }}
                  />
                </Box>

                {idx < data.steps.length - 1 && (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 1.5 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <ArrowDownwardRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      {data.steps[idx + 1].tasaCaidaAnterior > 0 && (
                        <Chip
                          icon={<TrendingDownRoundedIcon sx={{ fontSize: 16 }} />}
                          label={`-${data.steps[idx + 1].tasaCaidaAnterior}% abandono`}
                          size="small"
                          sx={{
                            backgroundColor: "#FEF2F2",
                            color: "#DC2626",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                          }}
                        />
                      )}
                    </Stack>
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </MainCard>
    </Stack>
  );
}

