"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import MainCard from "@/components/MainCard";
import KpiCard from "@/components/KpiCard";
import { verde, verdePastel, verdeOscuro, grisBorde } from "@/theme";

type UptimeData = {
  online: boolean;
  statusCode: number;
  latencyMs: number | null;
  error: string | null;
  lastChecked: string;
  domain: string;
  targetUrl: string;
};

export default function UptimeStatusCard({ siteId }: { siteId: string }) {
  const [data, setData] = useState<UptimeData | null>(null);
  const [cargando, setCargando] = useState(true);
  const [verificando, setVerificando] = useState(false);

  useEffect(() => {
    let cancelado = false;

    fetch(`/api/sites/${siteId}/uptime`)
      .then((res) => res.json())
      .then((resultado) => {
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
  }, [siteId]);

  const consultarUptime = () => {
    setVerificando(true);
    fetch(`/api/sites/${siteId}/uptime`)
      .then((res) => res.json())
      .then((resultado) => {
        setData(resultado);
        setVerificando(false);
      })
      .catch(() => {
        setVerificando(false);
      });
  };

  if (cargando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const isOnline = data?.online ?? false;
  const latencia = data?.latencyMs ?? 0;

  const getCalidadLatencia = (ms: number) => {
    if (ms < 300) return { texto: "Excelente", color: verde };
    if (ms < 700) return { texto: "Aceptable", color: "#F59E0B" };
    return { texto: "Lenta", color: "#EF4444" };
  };

  const calidad = getCalidadLatencia(latencia);

  return (
    <Stack spacing={3}>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <KpiCard
            variant={isOnline ? "dark" : "light"}
            icon={isOnline ? <CheckCircleOutlinedIcon /> : <ErrorOutlinedIcon color="error" />}
            label="Estado del Servidor"
            value={isOnline ? "Operativo" : "Inaccesible"}
            sublabel={isOnline ? `Código HTTP ${data?.statusCode} OK` : `Error: ${data?.error || "Servidor caído"}`}
            sx={!isOnline ? { borderColor: "error.main", backgroundColor: "#FEF2F2" } : {}}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <KpiCard
            variant="light"
            icon={<SpeedOutlinedIcon />}
            label="Tiempo de Respuesta (Latencia)"
            value={`${latencia} ms`}
            sublabel={`Velocidad de respuesta: ${calidad.texto}`}
          />
        </Grid>
      </Grid>

      <MainCard
        title="Detalles de Conexión y Disponibilidad"
        secondary={
          <Button
            size="small"
            variant="outlined"
            onClick={consultarUptime}
            disabled={verificando}
            startIcon={
              verificando ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <RefreshOutlinedIcon sx={{ fontSize: 16 }} />
              )
            }
            sx={{ fontSize: "0.75rem", py: 0.5, px: 1.5 }}
          >
            {verificando ? "Comprobando..." : "Comprobar ahora"}
          </Button>
        }
      >
        <TableContainer>
          <Table size="small">
            <TableBody>
              <TableRow hover>
                <TableCell sx={{ fontWeight: 600, width: 220, color: "text.secondary" }}>
                  URL Objetivo
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <HttpsOutlinedIcon sx={{ fontSize: 16, color: verde }} />
                    <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                      {data?.targetUrl}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>

              <TableRow hover>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                  Estado HTTP
                </TableCell>
                <TableCell>
                  <Chip
                    label={isOnline ? `${data?.statusCode} - En línea` : `${data?.statusCode} - Error`}
                    size="small"
                    sx={{
                      backgroundColor: isOnline ? verdePastel : "#FEE2E2",
                      color: isOnline ? verdeOscuro : "#DC2626",
                      fontWeight: 700,
                    }}
                  />
                </TableCell>
              </TableRow>

              <TableRow hover>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                  Latencia de Red
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: calidad.color }}>
                    {latencia} ms ({calidad.texto})
                  </Typography>
                </TableCell>
              </TableRow>

              <TableRow hover>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
                  Última Comprobación
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {data?.lastChecked ? new Date(data.lastChecked).toLocaleString("es-CL") : "N/A"}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2.5, p: 2, borderRadius: 2, backgroundColor: "background.default", border: `1px solid ${grisBorde}` }}>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
            💡 <strong>Monitor de Salud:</strong> Esta prueba realiza una solicitud HEAD segura con timeout de 8 segundos para validar la disponibilidad y el certificado SSL de la aplicación.
          </Typography>
        </Box>
      </MainCard>
    </Stack>
  );
}

