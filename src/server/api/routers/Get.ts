import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "ernst_stephen_fischer/server/api/trpc";

//all the get procedures I needed
export const getRouter = createTRPCRouter({
    getEmployees: publicProcedure
    .query(async({ctx}) => {
      const employees = await ctx.db.employees.findMany();
      return employees
    }),
    getManagerEmployeesLink: publicProcedure
    .query(async({ctx}) => {
      const ManagerEmployees = await ctx.db.managerEmployee.findMany()
      return ManagerEmployees
    }),
    getAllManager: publicProcedure
    .query(async({ctx}) => {
      const managers = await ctx.db.manager.findMany()
      return managers
    }),
    getDepartment: publicProcedure
    .query(async({ctx}) => {
      const departments = await ctx.db.departments.findMany()
      return departments
    }),
    getDepartmentManagerLink: publicProcedure
    .query(async({ctx}) => {
      const departmentManagerLink = ctx.db.managerDepartment.findMany()
      return departmentManagerLink
    })
});
