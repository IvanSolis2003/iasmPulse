"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import TouchAppOutlinedIcon from "@mui/icons-material/TouchAppOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import ResumenSitio from "@/components/ResumenSitio";
import HeatmapSitio from "@/components/HeatmapSitio";
import UptimeStatusCard from "@/components/UptimeStatusCard";
import { grisBorde } from "@/theme";

export default function SiteTabs({ siteId }: { siteId: string }) {
  const [vista, setVista] = useState<"resumen" | "heatmap" | "uptime">("resumen");

  return (
    <Box>
      <Box sx={{ borderBottom: `1px solid ${grisBorde}`, mb: 3 }}>
        <Tabs
          value={vista}
          onChange={(_e, valor) => setVista(valor)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab
            icon={<AssessmentOutlinedIcon fontSize="small" />}
            iconPosition="start"
            label="Resumen de Métricas"
            value="resumen"
            sx={{ minHeight: 48, px: 2.5 }}
          />
          <Tab
            icon={<TouchAppOutlinedIcon fontSize="small" />}
            iconPosition="start"
            label="Mapa de Calor (Heatmap)"
            value="heatmap"
            sx={{ minHeight: 48, px: 2.5 }}
          />
          <Tab
            icon={<HealthAndSafetyOutlinedIcon fontSize="small" />}
            iconPosition="start"
            label="Disponibilidad (Uptime)"
            value="uptime"
            sx={{ minHeight: 48, px: 2.5 }}
          />
        </Tabs>
      </Box>

      {vista === "resumen" && <ResumenSitio siteId={siteId} />}
      {vista === "heatmap" && <HeatmapSitio siteId={siteId} />}
      {vista === "uptime" && <UptimeStatusCard siteId={siteId} />}
    </Box>
  );
}
