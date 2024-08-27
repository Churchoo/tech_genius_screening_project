import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "ernst_stephen_fischer/server/api/trpc";

export const insertRouter = createTRPCRouter({
    insertUser: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation( async ({ ctx, input }) => {
        await ctx.db.user.create({
        data: {
          userName: input.name,
        },
      });
    }),
   
})