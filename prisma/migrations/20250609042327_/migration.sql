/*
  Warnings:

  - You are about to drop the column `isActive` on the `GroupCategory` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `GroupCategory_isActive_createdAt_idx` ON `GroupCategory`;

-- AlterTable
ALTER TABLE `GroupCategory` DROP COLUMN `isActive`;

-- CreateIndex
CREATE INDEX `GroupCategory_createdAt_idx` ON `GroupCategory`(`createdAt`);
