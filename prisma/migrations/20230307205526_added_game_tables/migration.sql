/*
  Warnings:

  - You are about to drop the `ChatMembers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('active', 'ended');

-- CreateEnum
CREATE TYPE "PlayerSide" AS ENUM ('side1', 'side2');

-- DropForeignKey
ALTER TABLE "ChatMembers" DROP CONSTRAINT "ChatMembers_memberId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMembers" DROP CONSTRAINT "ChatMembers_roomId_fkey";

-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropTable
DROP TABLE "ChatMembers";

-- DropTable
DROP TABLE "ChatRoom";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Profile";

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'default_avatar.png',
    "username" VARCHAR(12) NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatRooms" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "status" "ChatRoomStatus" NOT NULL,
    "password" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chatRooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "senderId" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatMembers" (
    "id" SERIAL NOT NULL,
    "memberId" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "status" "ChatMemberStatus" NOT NULL,
    "rank" "ChatMemberRank" NOT NULL,
    "endOfBan" TIMESTAMP(3),
    "endOfMute" TIMESTAMP(3),

    CONSTRAINT "chatMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "roomId" TEXT,
    "status" "MatchStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "memberId" TEXT,
    "score" INTEGER NOT NULL,
    "sidePlayed" "PlayerSide" NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatRooms" ADD CONSTRAINT "chatRooms_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chatRooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatMembers" ADD CONSTRAINT "chatMembers_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatMembers" ADD CONSTRAINT "chatMembers_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chatRooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
