import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/session";
import { SecretaryVerificationView } from "@/features/projects/components/secretary/SecretaryVerificationView";

export default async function SecretaryScreeningPage() {
  const session = await getUserSession();

  if (!session?.userId) {
    redirect("/login");
  }

  const roles = Array.isArray(session.roles) ? session.roles : [];
  if (!roles.includes("secretary")) {
    redirect("/dashboard");
  }

  return <SecretaryVerificationView />;
}
