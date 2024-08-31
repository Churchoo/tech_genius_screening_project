import {  z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "ernst_stephen_fischer/server/api/trpc";

export const updateRouter = createTRPCRouter({
    updateEmployees: publicProcedure
    .input(z.object({ id: z.number(), firstName: z.string(), lastName: z.string(), telephoneNumber: z.string(), emailAddress: z.string(), status: z.boolean(), role: z.string()}))
    .mutation( async ({ ctx, input }) => {
        await ctx.db.employees.update({
        data: {
          id: input.id,
          firstName: input.firstName,
          lastName: input.lastName,
          telephoneNumber: input.telephoneNumber,
          emailAddress: input.emailAddress,
          status: input.status,
          role: input.role,
        },
        where: {
            id: input.id
        }
      });
      return 'Success'
    }),
   updateEmployeeManagerLink: publicProcedure
   .input(z.object({EmployeeId: z.number(), managerId: z.number()}))
   .mutation( async({ctx, input}) => {
    await ctx.db.managerEmployee.update({
      data: {
        managerId: input.managerId
      },
      where: {
        EmployeeId: input.EmployeeId
      }
    })
   }),
   updateManager: publicProcedure
   .input(z.object({oldEmail: z.string(), newEmail: z.string(), managerName: z.string()}))
   .mutation(async({ctx, input}) => {
    await ctx.db.manager.update({
      data:{
        emailAddress: input.newEmail,
        managerName: input.managerName
      },
      where: {
        emailAddress: input.oldEmail
      }
    })
   }),
   updateDepartment: publicProcedure
   .input(z.object({id: z.number(), name: z.string(), status: z.boolean()}))
   .mutation(async({ctx, input}) => {
    await ctx.db.departments.update({
      data: {
        name: input.name,
        status: input.status
      },
      where: {
        id: input.id
      }
    })
   }),
   updateDepartmentManagerLink: publicProcedure
   .input(z.object({managerId: z.number(), departmentId: z.number()}))
   .mutation(async({ctx, input}) => {
    await ctx.db.managerDepartment.update({
      data: {
        managerId: input.managerId
      },
      where: {
        DepartmentId: input.departmentId
      }
    })
   })
})