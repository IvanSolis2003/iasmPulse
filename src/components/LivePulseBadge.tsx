"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { keyframes } from "@mui/material/styles";
import { verdeClaro, verdePastel, verdeOscuro } from "@/theme";

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(76, 175, 80, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
`;

export default function LivePulseBadge({ count }: { count: number }) {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      sx={{
        alignItems: "center",
        backgroundColor: verdePastel,
        border: "1px solid rgba(76, 175, 80, 0.3)",
        borderRadius: 3,
        py: 0.5,
        px: 1.5,
        width: "fit-content",
      }}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: verdeClaro,
          animation: `${pulseAnimation} 2s infinite`,
        }}
      />
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          color: verdeOscuro,
          fontSize: "0.75rem",
          letterSpacing: "0.02em",
        }}
      >
        {count} {count === 1 ? "visitante activo" : "visitantes activos"} en vivo
      </Typography>
    </Stack>
  );
}

