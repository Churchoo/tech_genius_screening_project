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
    }) 
});
