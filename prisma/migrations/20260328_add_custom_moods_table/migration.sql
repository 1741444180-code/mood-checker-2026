-- CreateTable
CREATE TABLE "CustomMood" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "imageUrls" TEXT[],
    "isSystem" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomMood_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomMood_userId_idx" ON "CustomMood"("userId");

-- CreateIndex
CREATE INDEX "CustomMood_isSystem_idx" ON "CustomMood"("isSystem");

-- AddForeignKey
ALTER TABLE "CustomMood" ADD CONSTRAINT "CustomMood_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Add customMoodId column to MoodRecord
ALTER TABLE "MoodRecord" ADD COLUMN "customMoodId" INTEGER;

-- CreateIndex for customMoodId
CREATE INDEX "MoodRecord_customMoodId_idx" ON "MoodRecord"("customMoodId");

-- AddForeignKey for MoodRecord to CustomMood
ALTER TABLE "MoodRecord" ADD CONSTRAINT "MoodRecord_customMoodId_fkey" 
    FOREIGN KEY ("customMoodId") REFERENCES "CustomMood"("id") 
    ON DELETE SET NULL ON UPDATE CASCADE;