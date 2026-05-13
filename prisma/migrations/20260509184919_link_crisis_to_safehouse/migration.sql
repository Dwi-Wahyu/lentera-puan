-- AlterTable
ALTER TABLE `CrisisReport` ADD COLUMN `safeHouseId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `CrisisReport_safeHouseId_fkey` ON `CrisisReport`(`safeHouseId`);

-- AddForeignKey
ALTER TABLE `CrisisReport` ADD CONSTRAINT `CrisisReport_safeHouseId_fkey` FOREIGN KEY (`safeHouseId`) REFERENCES `SafeHouse`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
