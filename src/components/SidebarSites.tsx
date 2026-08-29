"use client";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { verde, verdePastel, verdeOscuro } from "@/theme";

type SiteResumen = {
  id: string;
  name: string;
  color: string | null;
};

export default function SidebarSites({
  sites,
  onNavigate,
}: {
  sites: SiteResumen[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const esHome = pathname === "/";

  return (
    <Box sx={{ px: 1.5, py: 1 }}>
      <List disablePadding sx={{ mb: 2 }}>
        <ListItemButton
          component={Link}
          href="/"
          onClick={onNavigate}
          selected={esHome}
          sx={{
            py: 1.25,
            px: 2,
            borderRadius: 2.5,
            mb: 0.5,
            backgroundColor: esHome ? verdePastel : "transparent",
            color: esHome ? verdeOscuro : "text.primary",
            "&:hover": {
              backgroundColor: verdePastel,
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: esHome ? verde : "text.secondary" }}>
            <DashboardOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography sx={{ fontSize: "0.875rem", fontWeight: esHome ? 700 : 500 }}>
                Inicio
              </Typography>
            }
          />
        </ListItemButton>
      </List>

      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", px: 2, mb: 1 }}>
        <Typography
          variant="caption"
          sx={{
            textTransform: "uppercase",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "text.secondary",
          }}
        >
          Sitios Monitoreados
        </Typography>
        <Chip
          label={sites.length}
          size="small"
          sx={{
            height: 20,
            fontSize: "0.6875rem",
            fontWeight: 700,
            backgroundColor: verdePastel,
            color: verdeOscuro,
          }}
        />
      </Stack>

      {sites.length === 0 ? (
        <Typography variant="body2" sx={{ px: 2, py: 1.5, color: "text.secondary", opacity: 0.7 }}>
          Sin sitios registrados
        </Typography>
      ) : (
        <List disablePadding>
          {sites.map((site) => {
            const esActivo = pathname === `/site/${site.id}`;
            const colorSitio = site.color || verde;

            return (
              <ListItemButton
                key={site.id}
                component={Link}
                href={`/site/${site.id}`}
                onClick={onNavigate}
                selected={esActivo}
                sx={{
                  py: 1.1,
                  px: 2,
                  borderRadius: 2.5,
                  mb: 0.5,
                  backgroundColor: esActivo ? verdePastel : "transparent",
                  color: esActivo ? verdeOscuro : "text.primary",
                  "&:hover": {
                    backgroundColor: verdePastel,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: 1,
                      backgroundColor: colorSitio,
                      boxShadow: `0 0 0 2px ${esActivo ? verdePastel : "#FFFFFF"}`,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      noWrap
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: esActivo ? 700 : 500,
                      }}
                    >
                      {site.name}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
      )}
    </Box>
  );
}
