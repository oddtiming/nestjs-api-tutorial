-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('online', 'offline', 'away');

-- CreateEnum
CREATE TYPE "ChatRoomStatus" AS ENUM ('dialogue', 'public', 'private', 'password');

-- CreateEnum
CREATE TYPE "ChatMemberRank" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "ChatMemberStatus" AS ENUM ('ok', 'blocked', 'muted', 'banned');

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT 'default_avatar.png',
    "username" VARCHAR(12) NOT NULL,
    "status" "UserStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "status" "ChatRoomStatus" NOT NULL,
    "password" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "senderId" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMembers" (
    "id" SERIAL NOT NULL,
    "memberId" TEXT NOT NULL,
    "status" "ChatMemberStatus" NOT NULL,
    "rank" "ChatMemberRank" NOT NULL,
    "endOfBan" TIMESTAMP(3),
    "endOfMute" TIMESTAMP(3),

    CONSTRAINT "ChatMembers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMembers" ADD CONSTRAINT "ChatMembers_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
