// src/app/(protected)/users/page.tsx
import { UserManagementView } from "@/features/users/components/UserManagementView";

export default function UsersManagementPage() {
  return (
    <div className="flex flex-col h-full p-6 lg:p-8 animate-in fade-in duration-500 mx-auto w-full">
      <UserManagementView></UserManagementView>
    </div>
  );
}