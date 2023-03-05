/*
  Warnings:

  - The primary key for the `bookmarks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `bookmarks` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_userId_fkey";

-- AlterTable
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
