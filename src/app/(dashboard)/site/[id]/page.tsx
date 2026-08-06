import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import prisma from "@/lib/prisma";

export default async function SitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const site = await prisma.site.findUnique({ where: { id } });

  if (!site) notFound();

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            width: 14,
            height: 14,
            backgroundColor: site.color || "primary.main",
          }}
        />
        <Typography variant="h1" color="primary">
          {site.name}
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ opacity: 0.6 }}>
        {site.domain}
      </Typography>
    </Stack>
  );
}
