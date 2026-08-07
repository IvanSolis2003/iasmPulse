"use client";

import { signOut } from "next-auth/react";
import Button from "@mui/material/Button";

export default function BotonCerrarSesion() {
  return (
    <Button
      size="small"
      color="inherit"
      onClick={() => signOut({ callbackUrl: "/login" })}
      sx={{ borderColor: "divider", color: "text.secondary" }}
    >
      Cerrar sesión
    </Button>
  );
}
