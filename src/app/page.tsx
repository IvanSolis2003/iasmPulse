import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function Home() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      <Stack spacing={1.5} sx={{ maxWidth: 480 }}>
        <Typography variant="caption" sx={{ textTransform: "uppercase", opacity: 0.5 }}>
          iasmtech
        </Typography>
        <Typography variant="h1" color="primary">
          iasmPulse
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.7 }}>
          Panel de monitoreo y analytics de las apps de iasmtech. Fase 1: base del
          proyecto lista.
        </Typography>
      </Stack>
    </Box>
  );
}
