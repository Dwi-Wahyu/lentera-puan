# LENTERA PUAN Frontend Web Application

Aplikasi Frontend (Web Interface) untuk sistem manajemen **LENTERA PUAN**, sebuah platform yang dirancang untuk mengelola laporan krisis, data kesehatan pasien (Ibu Hamil & Balita), rumah aman, dan sesi intervensi bagi korban kekerasan.

## Tech Stack & Libraries

Frontend ini dibangun menggunakan framework **Next.js** modern dengan performa tinggi, desain premium berbasis CSS modern, dan sistem otentikasi terintegrasi.

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) - Rendering berbasis server (SSR) dan optimasi routing.
- **Library UI:** [React 19](https://react.dev/) - Pustaka utama untuk komponen UI.
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) - Kerangka kerja CSS modern untuk desain yang bersih dan responsif.
- **Authentication:** [NextAuth.js v4](https://next-auth.js.org/) - Integrasi otentikasi berbasis session menggunakan token JWT yang aman.
- **Icons:** [Lucide React](https://lucide.dev/) - Kumpulan ikon vektor modern yang ringan.

## Fitur & Struktur Halaman (Routing)

Aplikasi web ini menggunakan sistem Next.js App Router dengan pembagian halaman sebagai berikut:

### 1. Dashboard Utama
| Route | Akses Role | Deskripsi |
| --- | --- | --- |
| `/dashboard` | Semua Role | Ringkasan operasional harian berbasis role. Menampilkan diagram dan metrik performa. |

### 2. Manajemen Ibu & Anak (KIA)
| Route | Akses Role | Deskripsi |
| --- | --- | --- |
| `/dashboard/kia` | Semua Role | List pasien KIA terpantau gizi dan kehamilannya (mendukung pencarian, kategori, dan status gizi). |
| `/dashboard/kia/new` | Semua Role | Form registrasi pasien baru. |
| `/dashboard/kia/[id]` | Semua Role | Detail riwayat medis pasien, riwayat checkup, dan status gizi. |

### 3. Pelaporan Krisis & Tindak Lanjut
| Route | Akses Role | Deskripsi |
| --- | --- | --- |
| `/dashboard/krisis` | Semua Role | List laporan kekerasan masuk (mendukung pencarian, status, prioritas, dan tipe kasus). |
| `/dashboard/krisis/new` | Semua Role | Form pengaduan / laporan kasus baru. |
| `/dashboard/krisis/[id]` | Semua Role | Detail kronologi kasus, riwayat penanganan (log investigasi), dan upload bukti lampiran. |

### 4. Rumah Aman (Safe House)
| Route | Akses Role | Deskripsi |
| --- | --- | --- |
| `/dashboard/safehouse` | Semua Role | Inventori rumah aman beserta status okupansi bed (terisi vs kapasitas). |
| `/dashboard/safehouse/[id]` | Semua Role | Detail hunian rumah aman beserta daftar pasien yang sedang dievakuasi di sana. |

### 5. Intervensi & Konseling
| Route | Akses Role | Deskripsi |
| --- | --- | --- |
| `/dashboard/konseling` | Semua Role | Daftar agenda sesi pendampingan psikologis maupun medis. |
| `/dashboard/konseling/kalender`| Semua Role | Tampilan kalender interaktif untuk memantau jadwal pertemuan harian. |
| `/dashboard/konseling/new` | Semua Role | Form penjadwalan sesi konseling baru. |

### 6. Manajemen Pengguna & Sistem
| Route | Akses Role | Deskripsi |
| --- | --- | --- |
| `/dashboard/users` | SUPER_ADMIN | Panel administrasi untuk mengelola akun personil dan hak akses petugas. |
| `/dashboard/settings` | Semua Role | Konfigurasi profil pribadi pengguna. |
| `/dashboard/settings/logs`| SUPER_ADMIN | Audit Log aktivitas personil sistem secara berkala (keamanan audit). |

## Struktur Direktori

```text
frontend/
├── app/                  # Routing Next.js (App Router)
│   ├── api/              # Route Handlers / API proxies internal
│   ├── dashboard/        # Seluruh halaman dashboard operasional
│   ├── layout.tsx        # Layout utama aplikasi
│   └── page.tsx          # Halaman landing page / login
├── components/           # Reusable UI Components (Button, Input, Card, dsb.)
├── lib/                  # Utilitas, API handler, & konfigurasi Auth
│   ├── api.ts            # Client SDK penghubung ke Backend API
│   ├── auth.ts           # Konfigurasi NextAuth (JWT & Session)
│   └── formatters.ts     # Formatting data (Enum, tanggal, dsb.)
├── public/               # Asset statik gambar dan ikon
└── types/                # TypeScript type definitions
```
