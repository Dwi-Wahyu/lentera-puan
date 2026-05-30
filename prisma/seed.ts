import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("wahil123", 10);

  // 1. Seed Users
  const wahil = await prisma.user.upsert({
    where: { email: "wahil@lp.go.id" },
    update: {},
    create: {
      email: "wahil@lp.go.id",
      name: "Jane Doe",
      password: password,
      role: "DP3A",
      nip: "198506122010012001",
      unit: "Kantor Pusat",
    },
  });

  const psikolog = await prisma.user.upsert({
    where: { email: "ahmad@lp.go.id" },
    update: {},
    create: {
      email: "ahmad@lp.go.id",
      name: "Dr. Ahmad",
      password: password,
      role: "PSIKOLOG",
      nip: "198506122010012003",
      unit: "RSUD Kota",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@lp.go.id" },
    update: {},
    create: {
      email: "admin@lp.go.id",
      name: "Super Admin",
      password: password,
      role: "ADMIN",
      nip: "197001012000011001",
      unit: "IT Support & System",
    },
  });

  // 2. Seed Patients
  const patient1 = await prisma.patient.upsert({
    where: { nik: "3201010101010001" },
    update: {},
    create: {
      name: "Ani Suryani",
      nik: "3201010101010001",
      category: "IBU_HAMIL",
      nutritionStatus: "NORMAL",
      lastCheckup: new Date(),
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { nik: "3201010101010002" },
    update: {},
    create: {
      name: "Budi Kecil",
      nik: "3201010101010002",
      category: "ANAK",
      nutritionStatus: "RISIKO_TINGGI",
      lastCheckup: new Date(),
    },
  });

  // 3. Seed Medical Checkups (Activities)
  await prisma.medicalCheckup.createMany({
    data: [
      { patientId: patient1.id, status: "NORMAL", notes: "Pemeriksaan rutin trimester 3" },
      { patientId: patient2.id, status: "PERLU_PERHATIAN", notes: "Imunisasi dan cek berat badan" },
    ],
  });

  // 4. Seed Safe Houses
  const sh1 = await prisma.safeHouse.create({
    data: { name: "Rumah Aman Melati", capacity: 12, occupied: 2, status: "HAMPIR_PENUH", safetyLevel: "TINGGI" },
  });
  await prisma.safeHouse.create({
    data: { name: "Shelter Mawar", capacity: 8, occupied: 0, status: "TERSEDIA", safetyLevel: "SANGAT_TINGGI" },
  });

  // 5. Seed Crisis Reports (Linked to Safe House)
  await prisma.crisisReport.createMany({
    data: [
      {
        victimInitials: "AS",
        type: "KDRT",
        status: "BARU",
        priority: "TINGGI",
        reporterId: wahil.id,
        safeHouseId: sh1.id,
        description: "Laporan kekerasan dalam rumah tangga fisik. Korban saat ini tinggal di Rumah Aman Melati.",
      },
      {
        victimInitials: "ML",
        type: "KEKERASAN_SEKSUAL",
        status: "INVESTIGASI",
        priority: "SANGAT_TINGGI",
        reporterId: wahil.id,
        safeHouseId: sh1.id,
        description: "Membutuhkan pendampingan hukum segera. Korban dievakuasi ke Rumah Aman Melati.",
      },
      {
        victimInitials: "RH",
        type: "ANCAMAN_KEAMANAN",
        status: "BARU",
        priority: "SANGAT_TINGGI",
        reporterId: wahil.id,
        description: "Ancaman pembunuhan dari mantan pasangan.",
      },
    ],
  });

  // 6. Seed Intervention Sessions
  await prisma.interventionSession.createMany({
    data: [
      {
        counselorId: psikolog.id,
        date: new Date(),
        time: "09:00 - 10:00",
        type: "PSIKOLOGIS",
        status: "SELESAI",
      },
      {
        counselorId: admin.id,
        date: new Date(),
        time: "11:00 - 12:00",
        type: "MEDIS",
        status: "MENDATANG",
      },
    ],
  });

  // 7. Seed System Config
  await prisma.systemConfig.upsert({
    where: { id: "default-config" },
    update: {},
    create: {
      id: "default-config",
      agencyName: "Dinas Pemberdayaan Perempuan & Perlindungan Anak",
      region: "Provinsi DKI Jakarta - Sektor Selatan",
      maintenanceMode: false,
    },
  });

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
