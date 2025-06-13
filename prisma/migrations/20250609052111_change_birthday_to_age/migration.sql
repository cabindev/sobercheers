/*
  Warnings:

  - You are about to drop the column `birthday` on the `Buddhist2025` table. All the data in the column will be lost.
  - Added the required column `age` to the `Buddhist2025` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Buddhist2025` DROP COLUMN `birthday`,
    ADD COLUMN `age` INTEGER NOT NULL;
