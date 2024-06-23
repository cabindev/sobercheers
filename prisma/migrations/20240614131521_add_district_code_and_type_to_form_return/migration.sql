/*
  Warnings:

  - You are about to drop the column `subDistrict` on the `Form_return` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Form_return` DROP COLUMN `subDistrict`,
    ADD COLUMN `amphoe` VARCHAR(191) NULL,
    ADD COLUMN `district_code` INTEGER NULL,
    ADD COLUMN `type` VARCHAR(191) NULL;
