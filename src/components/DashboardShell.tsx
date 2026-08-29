"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import SidebarSites from "@/components/SidebarSites";
import { verde, verdePastel, verdeOscuro, grisBorde, grisFondo } from "@/theme";

const ANCHO_SIDEBAR = 260;
const ALTO_HEADER = 70;

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
  const [drawerAbierto, setDrawerAbierto] = useState(false);

  const toggleDrawer = () => {
    setDrawerAbierto(!drawerAbierto);
  };

  const contenidoSidebar = (
    <Stack sx={{ height: "100%", justifyContent: "space-between" }}>
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <SidebarSites sites={sites} onNavigate={() => esMovil && setDrawerAbierto(false)} />
      </Box>

      <Box sx={{ p: 2, borderTop: `1px solid ${grisBorde}` }}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
            <Avatar
              sx={{
                width: 34,
                height: 34,
                backgroundColor: verdePastel,
                color: verdeOscuro,
                fontWeight: 700,
                fontSize: "0.875rem",
              }}
            >
              I
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                Iván
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.6875rem" }}>
                Administrador
              </Typography>
            </Box>
          </Stack>

          <IconButton
            size="small"
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Cerrar sesión"
            sx={{
              color: "text.secondary",
              "&:hover": { color: "error.main", backgroundColor: "error.light", opacity: 0.15 },
            }}
          >
            <LogoutRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </Stack>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: grisFondo }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          height: ALTO_HEADER,
          backgroundColor: "#FFFFFF",
          borderBottom: `1px solid ${grisBorde}`,
          boxShadow: "0 1px 4px 0 rgba(32, 40, 45, 0.04)",
          zIndex: (t) => t.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ height: ALTO_HEADER, px: { xs: 2, sm: 3 } }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexGrow: 1 }}>
            <IconButton
              onClick={toggleDrawer}
              sx={{
                backgroundColor: verdePastel,
                color: verde,
                borderRadius: 2,
                p: 1,
                "&:hover": {
                  backgroundColor: verde,
                  color: "#FFFFFF",
                },
                transition: "all 0.2s ease-in-out",
              }}
              aria-label="Alternar menú"
            >
              {drawerAbierto && !esMovil ? (
                <MenuOpenIcon fontSize="small" />
              ) : (
                <MenuIcon fontSize="small" />
              )}
            </IconButton>

            <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", gap: 10 }}>
              <Image
                src="/logo-icon.png"
                alt="iasmtech"
                width={32}
                height={32}
                style={{ width: 32, height: 32, borderRadius: 6 }}
                unoptimized
                priority
              />
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="caption" sx={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.08em", color: "text.secondary", lineHeight: 1 }}>
                  iasmtech
                </Typography>
                <Typography variant="h2" color="primary" sx={{ lineHeight: 1.1, fontWeight: 700 }}>
                  iasmPulse
                </Typography>
              </Box>
            </Link>
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                backgroundColor: verdePastel,
                py: 0.6,
                px: 1.25,
                borderRadius: 3,
                border: `1px solid ${grisBorde}`,
              }}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  backgroundColor: verde,
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                }}
              >
                I
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 600, color: verdeOscuro, display: { xs: "none", sm: "block" } }}>
                Iván
              </Typography>
              <IconButton
                size="small"
                onClick={() => signOut({ callbackUrl: "/login" })}
                title="Cerrar sesión"
                sx={{ p: 0.25, color: verdeOscuro }}
              >
                <LogoutRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      {esMovil ? (
        <Drawer
          variant="temporary"
          open={drawerAbierto}
          onClose={() => setDrawerAbierto(false)}
          ModalProps={{ keepMounted: true }}
          slotProps={{
            paper: {
              sx: {
                width: ANCHO_SIDEBAR,
                mt: `${ALTO_HEADER}px`,
                height: `calc(100% - ${ALTO_HEADER}px)`,
                boxSizing: "border-box",
                borderRight: `1px solid ${grisBorde}`,
                boxShadow: "4px 0 16px rgba(0, 0, 0, 0.08)",
              },
            },
          }}
        >
          {contenidoSidebar}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          slotProps={{
            paper: {
              sx: {
                width: ANCHO_SIDEBAR,
                mt: `${ALTO_HEADER}px`,
                height: `calc(100% - ${ALTO_HEADER}px)`,
                boxSizing: "border-box",
                borderRight: `1px solid ${grisBorde}`,
              },
            },
          }}
        >
          {contenidoSidebar}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: { xs: 2, sm: 3, md: 4 },
          mt: `${ALTO_HEADER}px`,
          ml: { xs: 0, md: `${ANCHO_SIDEBAR}px` },
          transition: "margin 0.2s ease-in-out",
        }}
      >
        <Box sx={{ maxWidth: 1400, mx: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
}
