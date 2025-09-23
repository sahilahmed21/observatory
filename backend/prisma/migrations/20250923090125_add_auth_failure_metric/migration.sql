/*
  Warnings:

  - You are about to drop the column `isAuthFailure` on the `Metric` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Metric" DROP COLUMN "isAuthFailure";
