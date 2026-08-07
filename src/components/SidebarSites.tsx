"use client";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import Link from "next/link";

type SiteResumen = {
  id: string;
  name: string;
  color: string | null;
};

export default function SidebarSites({ sites }: { sites: SiteResumen[] }) {
  if (sites.length === 0) {
    return (
      <Typography variant="body2" sx={{ px: 2, opacity: 0.5 }}>
        Sin sitios registrados
      </Typography>
    );
  }

  return (
    <List sx={{ px: 1 }}>
      {sites.map((site) => (
        <ListItemButton
          key={site.id}
          component={Link}
          href={`/site/${site.id}`}
          sx={{ borderRadius: 0, gap: 1.5 }}
        >
          <Box
            sx={{
              width: 10,
              height: 10,
              flexShrink: 0,
              backgroundColor: site.color || "primary.main",
            }}
          />
          <Typography variant="body2">{site.name}</Typography>
        </ListItemButton>
      ))}
    </List>
  );
}
