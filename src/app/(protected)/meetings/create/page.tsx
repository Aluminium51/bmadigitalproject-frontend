// src/app/(protected)/meetings/create/page.tsx
import { CreateMeetingForm } from "@/features/meetings/components/CreateMeetingForm";

export default function CreateMeetingPage() {
  return (
    <div className="bg-slate-50/50 p-6 sm:p-10">
      <CreateMeetingForm />
    </div>
  );
}
