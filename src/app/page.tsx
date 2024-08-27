import Link from "next/link";
import Login from "./_components/Login";
import { LatestPost } from "ernst_stephen_fischer/app/_components/post";
import { getServerAuthSession } from "ernst_stephen_fischer/server/auth";
import { api, HydrateClient } from "ernst_stephen_fischer/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main>
        <Login/>
      </main>
    </HydrateClient>
  );
}
