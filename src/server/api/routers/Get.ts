import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "ernst_stephen_fischer/server/api/trpc";

export const getRouter = createTRPCRouter({
    getEmployees: publicProcedure
    .query(async({ctx}) => {
      const employees = await ctx.db.employees.findMany();
      return employees
    }),
    getLoggedInEmployee: publicProcedure
    .input(z.object({userName: z.string(), password: z.string()}))
    .query(async({ctx, input}) => {
      const employee = await ctx.db.employees.findFirst({
        where: {
           emailAddress: input.userName,
           password: input.password
        }
      })
      return employee
    }),
    getSingleEmployee: publicProcedure
    .input(z.object({id: z.number()}))
    .query(async({ctx, input}) => {
      const employee = await ctx.db.employees.findFirst({
        where: {
          id: input.id,
        }
      })
      return employee
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
    getManager: publicProcedure
    .input(z.object({emailAddress: z.string(), role: z.string()}))
    .query(async({ctx, input}) => {
      if(input.role==='Manager'){
        const manager = await ctx.db.manager.findFirst({
          where: {
            emailAddress: input.emailAddress
          }
        })
        return manager
      }
      return {id: 0, managerName: '', emailAddress: ''}
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
