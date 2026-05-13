-- CreateTable
CREATE TABLE `Distribution` (
    `id` VARCHAR(191) NOT NULL,
    `logisticId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `recipient` VARCHAR(191) NOT NULL,
    `staffId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Distribution_logisticId_idx`(`logisticId`),
    INDEX `Distribution_staffId_idx`(`staffId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Distribution` ADD CONSTRAINT `Distribution_logisticId_fkey` FOREIGN KEY (`logisticId`) REFERENCES `Logistic`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Distribution` ADD CONSTRAINT `Distribution_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
