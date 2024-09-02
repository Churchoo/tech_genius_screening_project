import { getRouter } from "ernst_stephen_fischer/server/api/routers/Get";
import { createCallerFactory, createTRPCRouter } from "ernst_stephen_fischer/server/api/trpc";
import { InsertRouter } from "./routers/Insert"; 
import { updateRouter } from "./routers/Update";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  get: getRouter,
  insert: InsertRouter,
  update: updateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
