-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "constituency" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "fingerprintHash" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vote_constituency_idx" ON "Vote"("constituency");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_fingerprintHash_constituency_key" ON "Vote"("fingerprintHash", "constituency");
