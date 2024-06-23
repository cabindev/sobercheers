-- CreateTable
CREATE TABLE `CampaignBuddhistLent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `birthday` DATETIME(3) NOT NULL,
    `age` INTEGER NOT NULL,
    `addressLine1` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `amphoe` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `zipcode` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `job` VARCHAR(191) NOT NULL,
    `alcoholConsumption` VARCHAR(191) NOT NULL,
    `drinkingFrequency` VARCHAR(191) NOT NULL,
    `intentPeriod` VARCHAR(191) NOT NULL,
    `monthlyExpense` INTEGER NOT NULL,
    `motivation` VARCHAR(191) NOT NULL,
    `healthImpact` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CampaignBuddhistLent_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CampaignBuddhistLent` ADD CONSTRAINT `CampaignBuddhistLent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
