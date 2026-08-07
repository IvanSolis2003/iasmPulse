"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import BotonCerrarSesion from "@/components/BotonCerrarSesion";
import SidebarSites from "@/components/SidebarSites";

const ANCHO_SIDEBAR = 260;

type SiteResumen = { id: string; name: string; color: string | null };

export default function DashboardShell({
  sites,
  children,
}: {
  sites: SiteResumen[];
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const esMovil = useMediaQuery(theme.breakpoints.down("md"));
  const [abierto, setAbierto] = useState(false);

  const contenido = (
    <Stack sx={{ height: "100%" }}>
      <Box sx={{ p: 2.5 }}>
        <Typography variant="caption" sx={{ textTransform: "uppercase", opacity: 0.5 }}>
          iasmtech
        </Typography>
        <Typography variant="h2" color="primary">
          iasmPulse
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <SidebarSites sites={sites} onNavigate={() => setAbierto(false)} />
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <BotonCerrarSesion />
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {esMovil && (
        <AppBar
          position="fixed"
          color="default"
          elevation={0}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          <Toolbar>
            <IconButton edge="start" onClick={() => setAbierto(true)} aria-label="Abrir menú">
              <MenuIcon />
            </IconButton>
            <Typography variant="h2" color="primary" sx={{ ml: 1 }}>
              iasmPulse
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        variant={esMovil ? "temporary" : "permanent"}
        open={esMovil ? abierto : true}
        onClose={() => setAbierto(false)}
        ModalProps={esMovil ? { keepMounted: true } : undefined}
        sx={{
          width: ANCHO_SIDEBAR,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: ANCHO_SIDEBAR, boxSizing: "border-box" },
        }}
      >
        {contenido}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: { xs: 2, md: 4 },
          mt: esMovil ? 7 : 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
