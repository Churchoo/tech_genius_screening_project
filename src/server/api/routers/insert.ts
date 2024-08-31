import { boolean, z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "ernst_stephen_fischer/server/api/trpc";

export const InsertRouter = createTRPCRouter({
  insertEmployees: publicProcedure
    .input(z.object({ firstName: z.string(), lastName: z.string(), telephoneNumber: z.string(), emailAddress: z.string(), status: z.boolean(), role: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.employees.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          telephoneNumber: input.telephoneNumber,
          emailAddress: input.emailAddress,
          password: 'Password123#',
          status: input.status,
          role: input.role,
        },
      });
      return 'Success'
    }),
  insertManager: publicProcedure
    .input(z.object({ name: z.string(), emailAddress: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.manager.create({
        data: {
          managerName: input.name,
          emailAddress: input.emailAddress
        }
      })
      return 'Success'
    }),
  insertManagerEmployeeLink: publicProcedure
    .input(z.object({ managerId: z.number(), employeeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.managerEmployee.create({
        data: {
          EmployeeId: input.employeeId,
          managerId: input.managerId
        }
      })
      return 'Success'
    }),
    insertDepartment: publicProcedure
    .input(z.object({name: z.string(), status: z.boolean()}))
    .mutation(async({ctx, input}) => {
      await ctx.db.departments.create({
        data: {
          name: input.name,
          status: input.status
        }
      })
      const newData = await ctx.db.departments.findFirst({
        where: {
          name: input.name
        }
      }) 
      return newData
    }),
    insertManagerDepartmentLink: publicProcedure
    .input(z.object({departmentId: z.number(), managerId: z.number()}))
    .mutation(async({ctx, input}) => {
      await ctx.db.managerDepartment.create({
        data: {
          DepartmentId: input.departmentId,
          managerId: input.managerId
        }
      })
      return 'Success'
    })
})