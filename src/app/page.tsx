import Link from "next/link";
import { getServerAuthSession } from "ernst_stephen_fischer/server/auth";
import { HydrateClient } from "ernst_stephen_fischer/trpc/server";
import Navigation from "./_components/Navigation";



export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <HydrateClient>
      <main>
        <Navigation />
      </main>
    </HydrateClient>
  );
}
//Can empoloyees only have 1 manager?
