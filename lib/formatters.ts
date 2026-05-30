export const formatEnum = (value: string | null | undefined): string => {
  if (!value) return "-";
  
  const mappings: Record<string, string> = {
    // Patient Category
    IBU_HAMIL: "Ibu Hamil",
    ANAK: "Anak / Balita",
    IBU_MENYUSUI: "Ibu Menyusui",

    // Nutrition / Checkup Status
    NORMAL: "Normal",
    PERLU_PERHATIAN: "Perlu Perhatian",
    RISIKO_TINGGI: "Risiko Tinggi",
    PEMULIHAN: "Dalam Pemulihan",

    // Crisis Status
    BARU: "Baru",
    INVESTIGASI: "Dalam Investigasi",
    TERVALIDASI: "Tervalidasi",
    SELESAI: "Selesai",

    // Crisis Priority
    RENDAH: "Rendah",
    MEDIUM: "Medium",
    TINGGI: "Tinggi",
    SANGAT_TINGGI: "Sangat Tinggi",

    // Crisis Type
    KDRT: "Kekerasan Dalam Rumah Tangga",
    KEKERASAN_SEKSUAL: "Kekerasan Seksual",
    ANCAMAN_KEAMANAN: "Ancaman Keamanan",
    INTERVENSI_MEDIS_DARURAT: "Intervensi Medis Darurat",
    LAINNYA: "Lainnya",

    // User Role
    PSIKOLOG: "Psikolog",
    DP3A: "Petugas DP3A",
    ADMIN: "Administrator",

    // Safe House Status
    TERSEDIA: "Tersedia",
    HAMPIR_PENUH: "Hampir Penuh",
    PENUH: "Penuh",

    // Intervention Type
    PSIKOLOGIS: "Psikologis Klinis",
    MEDIS: "Medis & KIA",
    SOSIAL: "Intervensi Sosial",
    HUKUM: "Pendampingan Hukum",

    // Intervention Status
    MENDATANG: "Mendatang",
    // SELESAI and BATAL already mapped above or below
    BATAL: "Dibatalkan",
  };

  return mappings[value] || value.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};
