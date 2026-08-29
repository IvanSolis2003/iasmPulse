import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import LanguageIcon from "@mui/icons-material/Language";
import prisma from "@/lib/prisma";
import MainCard from "@/components/MainCard";
import SiteTabs from "@/components/SiteTabs";
import { verde, verdePastel, grisBorde } from "@/theme";

export default async function SitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const site = await prisma.site.findUnique({ where: { id } });

  if (!site) notFound();

  const colorSitio = site.color || verde;

  return (
    <Stack spacing={3}>
      <MainCard
        sx={{
          p: { xs: 1, sm: 1.5 },
          backgroundColor: "#FFFFFF",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                backgroundColor: colorSitio,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: `0 4px 12px ${colorSitio}40`,
                flexShrink: 0,
              }}
            >
              <LanguageIcon />
            </Box>
            <Box>
              <Typography variant="h1" sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" }, fontWeight: 700 }}>
                {site.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
                {site.domain}
              </Typography>
            </Box>
          </Stack>

          <Chip
            label="Sitio Activo"
            size="small"
            sx={{
              backgroundColor: verdePastel,
              color: verde,
              fontWeight: 700,
              border: `1px solid ${grisBorde}`,
            }}
          />
        </Stack>
      </MainCard>

      <SiteTabs siteId={site.id} />
    </Stack>
  );
}
