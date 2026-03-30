# Migration to add theme support to User model
-- AlterTable
ALTER TABLE "User" ADD COLUMN "theme" TEXT NOT NULL DEFAULT 'light';
