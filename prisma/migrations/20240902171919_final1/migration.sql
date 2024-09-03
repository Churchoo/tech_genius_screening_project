-- CreateTable
CREATE TABLE "Employees" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "telephoneNumber" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Manager" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "managerName" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ManagerEmployee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "managerId" INTEGER NOT NULL,
    "EmployeeId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Departments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "ManagerDepartment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "managerId" INTEGER NOT NULL,
    "DepartmentId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Employees_emailAddress_key" ON "Employees"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "Manager_emailAddress_key" ON "Manager"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "ManagerEmployee_EmployeeId_key" ON "ManagerEmployee"("EmployeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Departments_name_key" ON "Departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ManagerDepartment_DepartmentId_key" ON "ManagerDepartment"("DepartmentId");
