import Link from "next/link";
import Login from "./_components/Login";
import { getServerAuthSession } from "ernst_stephen_fischer/server/auth";
import { api, HydrateClient } from "ernst_stephen_fischer/trpc/server";
import Employee_List from "./_components/Employee_List";
import Employee_Edit_Create from "./_components/Employee_Edit_Create";
import { useState } from "react";
interface Employees {
  id: number,
  firstName: string,
  lastName: string,
  telephoneNumber: string,
  emailAddress: string,
  status: boolean,
  role: string
}
export default async function Home() {
  const session = await getServerAuthSession();


  return (
    <HydrateClient>
      <main>
          <Employee_List />

      </main>
    </HydrateClient>
  );
}
//Can empoloyees only have 1 manager?
