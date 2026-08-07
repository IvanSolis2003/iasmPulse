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
        p: 4,
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 360 }}>
        <Stack spacing={3}>
          <Stack spacing={1.5} sx={{ alignItems: "flex-start" }}>
            <Image
              src="/logo-iasmtech.png"
              alt="iasmtech"
              width={640}
              height={280}
              style={{ width: "100%", maxWidth: 260, height: "auto" }}
              unoptimized
              priority
            />
            <Typography variant="h1" color="primary">
              iasmPulse
            </Typography>
          </Stack>

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            fullWidth
          />

          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            fullWidth
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="outlined" size="large" disabled={cargando} fullWidth>
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
