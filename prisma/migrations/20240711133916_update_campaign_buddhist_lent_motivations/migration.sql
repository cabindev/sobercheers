/*
  Warnings:

  - You are about to drop the column `motivation` on the `CampaignBuddhistLent` table. All the data in the column will be lost.
  - Added the required column `motivations` to the `CampaignBuddhistLent` table without a default value. This is not possible if the table is not empty.
  - Made the column `gender` on table `CampaignBuddhistLent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `CampaignBuddhistLent` DROP COLUMN `motivation`,
    ADD COLUMN `motivations` JSON NOT NULL,
    MODIFY `type` VARCHAR(191) NULL,
    MODIFY `drinkingFrequency` VARCHAR(191) NULL,
    MODIFY `intentPeriod` VARCHAR(191) NULL,
    MODIFY `monthlyExpense` INTEGER NULL,
    MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `gender` VARCHAR(191) NOT NULL;
