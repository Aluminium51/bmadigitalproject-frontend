import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/session";
import { AssignmentView } from "@/features/projects/components/AssignmentView";

export default async function AssignmentPage() {
  const session = await getUserSession();

  if (!session?.userId) {
    redirect("/login");
  }

  const roles = Array.isArray(session.roles)
    ? (session.roles as unknown[]).map((role) => String(role).toLowerCase())
    : [];

  if (!roles.includes("admin") && !roles.includes("super_admin")) {
    redirect("/projects");
  }

  return <AssignmentView />;
}
