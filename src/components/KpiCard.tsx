"use client";

import React, { ReactNode } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { SxProps, Theme } from "@mui/material/styles";
import { verde, verdeOscuro, verdePastel, verdeSuave } from "@/theme";

interface KpiCardProps {
  variant?: "dark" | "light";
  icon: ReactNode;
  label: string;
  value: number | string;
  sublabel?: string;
  sx?: SxProps<Theme>;
}

export default function KpiCard({
  variant = "dark",
  icon,
  label,
  value,
  sublabel,
  sx = {},
}: KpiCardProps) {
  const isDark = variant === "dark";

  return (
    <Card
      sx={{
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        backgroundColor: isDark ? verdeOscuro : verdePastel,
        color: isDark ? "#FFFFFF" : "#1E293B",
        border: isDark ? "none" : `1px solid ${verdeSuave}`,
        boxShadow: isDark
          ? "0 4px 14px 0 rgba(27, 94, 32, 0.25)"
          : "0 2px 12px 0 rgba(46, 125, 50, 0.06)",
        p: { xs: 2.25, sm: 2.75 },
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: isDark
            ? "0 6px 20px 0 rgba(27, 94, 32, 0.35)"
            : "0 4px 18px 0 rgba(46, 125, 50, 0.12)",
        },
        "&:before": {
          content: '""',
          position: "absolute",
          width: { xs: 150, sm: 180 },
          height: { xs: 150, sm: 180 },
          borderRadius: "50%",
          top: { xs: -60, sm: -70 },
          right: { xs: -30, sm: -40 },
          background: isDark
            ? "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)"
            : "radial-gradient(circle, rgba(46,125,50,0.12) 0%, rgba(46,125,50,0) 70%)",
          pointerEvents: "none",
        },
        "&:after": {
          content: '""',
          position: "absolute",
          width: { xs: 180, sm: 220 },
          height: { xs: 180, sm: 220 },
          borderRadius: "50%",
          top: { xs: -100, sm: -110 },
          right: { xs: -70, sm: -80 },
          background: isDark
            ? "radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 70%)"
            : "radial-gradient(circle, rgba(46,125,50,0.08) 0%, rgba(46,125,50,0) 70%)",
          pointerEvents: "none",
        },
        ...sx,
      }}
    >
      <Stack spacing={1.5} sx={{ position: "relative", zIndex: 1 }}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Avatar
            variant="rounded"
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.16)" : "#FFFFFF",
              color: isDark ? "#FFFFFF" : verde,
              boxShadow: isDark ? "none" : "0 2px 8px rgba(46, 125, 50, 0.08)",
            }}
          >
            {icon}
          </Avatar>
        </Stack>

        <Box sx={{ mt: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: isDark ? "#FFFFFF" : verdeOscuro,
            }}
          >
            {typeof value === "number" ? value.toLocaleString("es-CL") : value}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 0.75,
              fontWeight: 500,
              color: isDark ? "rgba(255, 255, 255, 0.85)" : "#5F5F5F",
            }}
          >
            {label}
          </Typography>
          {sublabel && (
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 0.25,
                color: isDark ? "rgba(255, 255, 255, 0.65)" : "text.secondary",
              }}
            >
              {sublabel}
            </Typography>
          )}
        </Box>
      </Stack>
    </Card>
  );
}

