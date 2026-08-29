"use client";

import React, { ReactNode } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { SxProps, Theme } from "@mui/material/styles";

interface MainCardProps {
  border?: boolean;
  boxShadow?: boolean;
  children?: ReactNode;
  content?: boolean;
  contentSX?: SxProps<Theme>;
  headerSX?: SxProps<Theme>;
  secondary?: ReactNode;
  shadow?: string;
  sx?: SxProps<Theme>;
  title?: ReactNode;
}

export default function MainCard({
  border = true,
  boxShadow = true,
  children,
  content = true,
  contentSX = {},
  headerSX = {},
  secondary,
  shadow,
  sx = {},
  title,
}: MainCardProps) {
  const defaultShadow = "0 2px 14px 0 rgba(32, 40, 45, 0.06)";

  return (
    <Card
      sx={{
        border: border ? "1px solid" : "none",
        borderColor: "divider",
        borderRadius: 3,
        boxShadow: boxShadow ? shadow || defaultShadow : "none",
        overflow: "hidden",
        backgroundColor: "background.paper",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          borderColor: "#CBD5E1",
          boxShadow: boxShadow ? "0 4px 20px 0 rgba(32, 40, 45, 0.09)" : "none",
        },
        ...sx,
      }}
    >
      {title && (
        <CardHeader
          sx={{
            p: { xs: 2, sm: 2.5 },
            "& .MuiCardHeader-action": { mr: 0, alignSelf: "center" },
            ...headerSX,
          }}
          title={
            typeof title === "string" ? (
              <Typography variant="h3" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            ) : (
              title
            )
          }
          action={secondary}
        />
      )}

      {title && <Divider />}

      {content ? (
        <CardContent sx={{ p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: { xs: 2, sm: 2.5 } }, ...contentSX }}>
          {children}
        </CardContent>
      ) : (
        children
      )}
    </Card>
  );
}

