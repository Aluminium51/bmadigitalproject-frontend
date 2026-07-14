// src/app/(protected)/profile/page.tsx
import { redirect } from "next/navigation";
import { UserProfileTemplate } from "@/features/users/templates/UserProfileTemplate";
import { getUserSession } from "@/lib/session";

export default async function UserProfilePage() {
  const session = await getUserSession();
  // ถ้าไม่มี Session หรือไม่มี userId ให้เตะกลับไปหน้า Login
  if (!session || !session.userId) {
     redirect("/login");
  }
  return <UserProfileTemplate currentUserId={session.userId} />;
}
