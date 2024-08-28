import { boolean, z } from "zod";

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
    }),
   
})