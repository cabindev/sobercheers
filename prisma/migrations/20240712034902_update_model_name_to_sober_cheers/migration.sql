/*
  Warnings:

  - You are about to drop the `SoberSheers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `SoberSheers`;

-- CreateTable
CREATE TABLE `SoberCheers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gender` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `birthday` DATETIME(3) NOT NULL,
    `addressLine1` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `amphoe` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `zipcode` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `job` VARCHAR(191) NOT NULL,
    `alcoholConsumption` VARCHAR(191) NOT NULL,
    `drinkingFrequency` VARCHAR(191) NULL,
    `intentPeriod` VARCHAR(191) NULL,
    `monthlyExpense` INTEGER NULL,
    `motivations` JSON NOT NULL,
    `healthImpact` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
