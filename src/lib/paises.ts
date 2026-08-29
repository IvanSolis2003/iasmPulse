const MAPA_PAISES: Record<string, { nombre: string; bandera: string }> = {
  CL: { nombre: "Chile", bandera: "🇨🇱" },
  AR: { nombre: "Argentina", bandera: "🇦🇷" },
  MX: { nombre: "México", bandera: "🇲🇽" },
  ES: { nombre: "España", bandera: "🇪🇸" },
  US: { nombre: "Estados Unidos", bandera: "🇺🇸" },
  CO: { nombre: "Colombia", bandera: "🇨🇴" },
  PE: { nombre: "Perú", bandera: "🇵🇪" },
  BR: { nombre: "Brasil", bandera: "🇧🇷" },
  UY: { nombre: "Uruguay", bandera: "🇺🇾" },
  EC: { nombre: "Ecuador", bandera: "🇪🇨" },
  BO: { nombre: "Bolivia", bandera: "🇧🇴" },
  PY: { nombre: "Paraguay", bandera: "🇵🇾" },
  VE: { nombre: "Venezuela", bandera: "🇻🇪" },
  CR: { nombre: "Costa Rica", bandera: "🇨🇷" },
  PA: { nombre: "Panamá", bandera: "🇵🇦" },
  DO: { nombre: "República Dominicana", bandera: "🇩🇴" },
  GT: { nombre: "Guatemala", bandera: "🇬🇹" },
  HN: { nombre: "Honduras", bandera: "🇭🇳" },
  SV: { nombre: "El Salvador", bandera: "🇸🇻" },
  NI: { nombre: "Nicaragua", bandera: "🇳🇮" },
  CA: { nombre: "Canadá", bandera: "🇨🇦" },
  DE: { nombre: "Alemania", bandera: "🇩🇪" },
  FR: { nombre: "Francia", bandera: "🇫🇷" },
  GB: { nombre: "Reino Unido", bandera: "🇬🇧" },
  IT: { nombre: "Italia", bandera: "🇮🇹" },
  PT: { nombre: "Portugal", bandera: "🇵🇹" },
};

function codigoABandera(codigo: string): string {
  if (codigo.length !== 2) return "🌐";
  const char1 = codigo.toUpperCase().charCodeAt(0) - 65 + 0x1f1e6;
  const char2 = codigo.toUpperCase().charCodeAt(1) - 65 + 0x1f1e6;
  return String.fromCodePoint(char1, char2);
}

export function obtenerPaisInfo(codigo: string | null | undefined): {
  nombre: string;
  bandera: string;
  codigo: string;
} {
  if (!codigo || typeof codigo !== "string") {
    return { nombre: "Desconocido", bandera: "🌐", codigo: "UNKNOWN" };
  }

  const cod = codigo.toUpperCase().trim();
  const info = MAPA_PAISES[cod];

  if (info) {
    return { nombre: info.nombre, bandera: info.bandera, codigo: cod };
  }

  return {
    nombre: cod,
    bandera: codigoABandera(cod),
    codigo: cod,
  };
}

