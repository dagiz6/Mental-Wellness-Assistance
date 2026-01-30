import HealthAdvicePage from './health-advice-client'
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HealthAdvice() {

        const session = await auth.api.getSession({
          headers: await headers(),
        });

        if (!session) {
          redirect("/auth");
        }

  return (
    <>
      <HealthAdvicePage/>
    </>
  )
}
