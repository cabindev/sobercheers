/*
  Warnings:

  - You are about to drop the `form_return` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `form_return`;

-- CreateTable
CREATE TABLE `FormReturn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `organizationName` VARCHAR(191) NOT NULL,
    `addressLine1` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `amphoe` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `zipcode` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `image1` VARCHAR(191) NOT NULL,
    `image2` VARCHAR(191) NOT NULL,
    `numberOfSigners` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FormReturn_phoneNumber_key`(`phoneNumber`),
    INDEX `FormReturn_createdAt_idx`(`createdAt`),
    INDEX `FormReturn_province_createdAt_idx`(`province`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
