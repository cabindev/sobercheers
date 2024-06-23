/*
  Warnings:

  - You are about to drop the column `image` on the `Form_return` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Form_return` DROP COLUMN `image`,
    ADD COLUMN `image1` VARCHAR(191) NULL,
    ADD COLUMN `image2` VARCHAR(191) NULL;
