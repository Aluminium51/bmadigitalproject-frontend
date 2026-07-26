import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/session";
import { AnalystView } from "@/features/projects/components/AnalystView";

export default async function AnalystTasksPage() {
  const session = await getUserSession();
  if (!session?.userId) redirect("/login");

  const roles = Array.isArray(session.roles)
    ? (session.roles as unknown[]).map((role) => String(role).toLowerCase())
    : [];
  if (!roles.includes("analyst")) redirect("/projects");

  return <AnalystView />;
}
