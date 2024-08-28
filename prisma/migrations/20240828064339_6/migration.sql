/*
  Warnings:

  - You are about to drop the `Authenticator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `Status` on the `Departments` table. All the data in the column will be lost.
  - You are about to drop the column `employeesId` on the `Departments` table. All the data in the column will be lost.
  - The primary key for the `Employees` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Employees` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `status` to the `Departments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Employees` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Authenticator_credentialID_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Authenticator";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Status";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Departments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL
);
INSERT INTO "new_Departments" ("id", "name") SELECT "id", "name" FROM "Departments";
DROP TABLE "Departments";
ALTER TABLE "new_Departments" RENAME TO "Departments";
CREATE UNIQUE INDEX "Departments_name_key" ON "Departments"("name");
CREATE TABLE "new_Employees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "telephoneNumber" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "employeeManager" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL
);
INSERT INTO "new_Employees" ("LastName", "emailAddress", "employeeManager", "firstName", "id", "telephoneNumber") SELECT "LastName", "emailAddress", "employeeManager", "firstName", "id", "telephoneNumber" FROM "Employees";
DROP TABLE "Employees";
ALTER TABLE "new_Employees" RENAME TO "Employees";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
