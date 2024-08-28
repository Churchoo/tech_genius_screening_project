/*
  Warnings:

  - You are about to drop the column `Role` on the `Employees` table. All the data in the column will be lost.
  - Added the required column `role` to the `Employees` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "telephoneNumber" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "role" TEXT NOT NULL
);
INSERT INTO "new_Employees" ("LastName", "emailAddress", "firstName", "id", "status", "telephoneNumber") SELECT "LastName", "emailAddress", "firstName", "id", "status", "telephoneNumber" FROM "Employees";
DROP TABLE "Employees";
ALTER TABLE "new_Employees" RENAME TO "Employees";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
