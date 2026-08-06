import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import prisma from "@/lib/prisma";
import BotonCerrarSesion from "@/components/BotonCerrarSesion";
import SidebarSites from "@/components/SidebarSites";

const ANCHO_SIDEBAR = 260;

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sites = await prisma.site.findMany({ orderBy: { name: "asc" } });

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: ANCHO_SIDEBAR,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: ANCHO_SIDEBAR, boxSizing: "border-box" },
        }}
      >
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
            <SidebarSites sites={sites} />
          </Box>

          <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
            <BotonCerrarSesion />
          </Box>
        </Stack>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        {children}
      </Box>
    </Box>
  );
}
