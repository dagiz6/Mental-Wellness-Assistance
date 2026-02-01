import JournalPage from "./journal-client";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getJournalEntries } from "@/lib/actions/journal-actions";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  const entries = await getJournalEntries();

  return <JournalPage initialEntries={entries} />;
}
