import { boolean, z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "ernst_stephen_fischer/server/api/trpc";

export const InsertRouter = createTRPCRouter({
    insertUser: publicProcedure
    .input(z.object({ name: z.string(), password: z.string()}))
    .mutation( async ({ ctx, input }) => {
        await ctx.db.user.create({
        data: {
          userName: input.name,
          password: input.password
        },
      });
    }),
    insertEmployees: publicProcedure
    .input(z.object({ firstName: z.string(), lastName: z.string(), telephoneNumber: z.string(), emailAddress: z.string(), status: z.boolean(), role: z.string()}))
    .mutation( async ({ ctx, input }) => {
        await ctx.db.employees.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          telephoneNumber: input.telephoneNumber,
          emailAddress: input.emailAddress,
          status: input.status,
          role: input.role,
        },
      });
    }),
   
})