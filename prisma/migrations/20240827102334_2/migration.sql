/*
  Warnings:

  - The primary key for the `Authenticator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `departmentsName` on the `Employees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Departments" ADD COLUMN "employeesId" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Authenticator" (
    "credentialID" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT
);
INSERT INTO "new_Authenticator" ("counter", "credentialBackedUp", "credentialDeviceType", "credentialID", "credentialPublicKey", "employeeId", "providerAccountId", "transports") SELECT "counter", "credentialBackedUp", "credentialDeviceType", "credentialID", "credentialPublicKey", "employeeId", "providerAccountId", "transports" FROM "Authenticator";
DROP TABLE "Authenticator";
ALTER TABLE "new_Authenticator" RENAME TO "Authenticator";
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");
CREATE TABLE "new_Employees" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "telephoneNumber" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "employeeManager" INTEGER NOT NULL
);
INSERT INTO "new_Employees" ("LastName", "emailAddress", "employeeManager", "firstName", "id", "telephoneNumber") SELECT "LastName", "emailAddress", "employeeManager", "firstName", "id", "telephoneNumber" FROM "Employees";
DROP TABLE "Employees";
ALTER TABLE "new_Employees" RENAME TO "Employees";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
