/*
  Warnings:

  - Made the column `image1` on table `Form_return` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image2` on table `Form_return` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Form_return` MODIFY `image1` VARCHAR(191) NOT NULL,
    MODIFY `image2` VARCHAR(191) NOT NULL;
