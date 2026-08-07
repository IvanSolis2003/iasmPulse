"use client";

import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ResumenSitio from "@/components/ResumenSitio";
import HeatmapSitio from "@/components/HeatmapSitio";

export default function SiteTabs({ siteId }: { siteId: string }) {
  const [vista, setVista] = useState<"resumen" | "heatmap">("resumen");

  return (
    <>
      <Tabs value={vista} onChange={(_e, valor) => setVista(valor)}>
        <Tab label="Resumen" value="resumen" />
        <Tab label="Heatmap" value="heatmap" />
      </Tabs>

      {vista === "resumen" ? (
        <ResumenSitio siteId={siteId} />
      ) : (
        <HeatmapSitio siteId={siteId} />
      )}
    </>
  );
}
