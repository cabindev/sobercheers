/*
  Warnings:

  - Made the column `amphoe` on table `Form_return` required. This step will fail if there are existing NULL values in that column.
  - Made the column `district_code` on table `Form_return` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `Form_return` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Form_return` MODIFY `amphoe` VARCHAR(191) NOT NULL,
    MODIFY `district_code` INTEGER NOT NULL,
    MODIFY `type` VARCHAR(191) NOT NULL;
