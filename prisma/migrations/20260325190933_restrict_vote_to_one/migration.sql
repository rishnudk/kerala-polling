/*
  Warnings:

  - A unique constraint covering the columns `[fingerprintHash]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Vote_fingerprintHash_constituency_key";

-- CreateIndex
CREATE UNIQUE INDEX "Vote_fingerprintHash_key" ON "Vote"("fingerprintHash");
