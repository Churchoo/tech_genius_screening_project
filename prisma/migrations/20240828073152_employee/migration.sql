/*
  Warnings:

  - The primary key for the `Departments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Departments` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to drop the column `employeeManager` on the `Employees` table. All the data in the column will be lost.
  - Added the required column `Role` to the `Employees` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Departments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL
);
INSERT INTO "new_Departments" ("id", "name", "status") SELECT "id", "name", "status" FROM "Departments";
DROP TABLE "Departments";
ALTER TABLE "new_Departments" RENAME TO "Departments";
CREATE UNIQUE INDEX "Departments_name_key" ON "Departments"("name");
CREATE TABLE "new_Employees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "telephoneNumber" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "Role" TEXT NOT NULL
);
INSERT INTO "new_Employees" ("LastName", "emailAddress", "firstName", "id", "status", "telephoneNumber") SELECT "LastName", "emailAddress", "firstName", "id", "status", "telephoneNumber" FROM "Employees";
DROP TABLE "Employees";
ALTER TABLE "new_Employees" RENAME TO "Employees";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
