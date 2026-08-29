"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import MainCard from "@/components/MainCard";
import { verde, verdePastel, verdeOscuro, grisFondo, grisBorde } from "@/theme";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError("");

    const resultado = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setCargando(false);

    if (resultado?.error) {
      setError("Email o contraseña incorrectos");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: grisFondo,
        p: { xs: 2, sm: 4 },
        position: "relative",
        overflow: "hidden",
        "&:before": {
          content: '""',
          position: "absolute",
          width: 380,
          height: 380,
          borderRadius: "50%",
          top: -120,
          right: -100,
          background: `radial-gradient(circle, ${verdePastel} 0%, rgba(248,250,252,0) 70%)`,
          pointerEvents: "none",
        },
        "&:after": {
          content: '""',
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          bottom: -150,
          left: -120,
          background: `radial-gradient(circle, ${verdePastel} 0%, rgba(248,250,252,0) 70%)`,
          pointerEvents: "none",
        },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        <MainCard
          border
          shadow="0 8px 30px rgba(0, 0, 0, 0.06)"
          sx={{
            p: { xs: 1.5, sm: 2.5 },
            borderColor: grisBorde,
            borderRadius: 3.5,
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack spacing={1.5} sx={{ alignItems: "center", textAlign: "center" }}>
                <Image
                  src="/logo-iasmtech.png"
                  alt="iasmtech"
                  width={640}
                  height={280}
                  style={{ width: "100%", maxWidth: 220, height: "auto" }}
                  unoptimized
                  priority
                />
                <Box>
                  <Typography variant="h2" sx={{ color: verdeOscuro, fontWeight: 700 }}>
                    iasmPulse
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                    Ingresa tus credenciales para acceder al panel
                  </Typography>
                </Box>
              </Stack>

              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                fullWidth
                size="medium"
              />

              <TextField
                label="Contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                fullWidth
                size="medium"
              />

              {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={cargando}
                fullWidth
                sx={{
                  py: 1.25,
                  fontSize: "0.9375rem",
                  backgroundColor: verde,
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: verdeOscuro,
                  },
                }}
              >
                {cargando ? (
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <CircularProgress size={18} color="inherit" />
                    <span>Ingresando...</span>
                  </Stack>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
            </Stack>
          </Box>
        </MainCard>
      </Box>
    </Box>
  );
}
