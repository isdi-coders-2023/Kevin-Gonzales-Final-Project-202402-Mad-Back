-- CreateEnum
CREATE TYPE "StateClub" AS ENUM ('pending', 'validated');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'validator', 'user');

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "founded" INTEGER NOT NULL,
    "state" "StateClub" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "country" TEXT,
    "role" "Role" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avatar" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "folder" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "bytes" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logo" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "folder" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "secureUrl" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "bytes" INTEGER NOT NULL,
    "clubId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Logo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClubToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_userId_key" ON "Avatar"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Logo_clubId_key" ON "Logo"("clubId");

-- CreateIndex
CREATE UNIQUE INDEX "_ClubToUser_AB_unique" ON "_ClubToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ClubToUser_B_index" ON "_ClubToUser"("B");

-- AddForeignKey
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logo" ADD CONSTRAINT "Logo_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubToUser" ADD CONSTRAINT "_ClubToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubToUser" ADD CONSTRAINT "_ClubToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
