-- CreateTable
CREATE TABLE `SystemConfig` (
    `id` VARCHAR(191) NOT NULL,
    `agencyName` VARCHAR(191) NOT NULL DEFAULT 'Dinas Pemberdayaan Perempuan & Perlindungan Anak',
    `region` VARCHAR(191) NOT NULL DEFAULT 'Provinsi DKI Jakarta - Sektor Selatan',
    `maintenanceMode` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
