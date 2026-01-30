import ChatClient from "./chat-client";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        redirect("/auth");
      }
  return <ChatClient />;
}
