/*
  Warnings:

  - Added the required column `userId` to the `ActivityUse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivityUse" ADD COLUMN     "userId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "ActivityUse" ADD CONSTRAINT "ActivityUse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
