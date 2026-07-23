// src/app/(protected)/projects/[id]/proposal/create/page.tsx
import React from "react";
import { CreateProposalWizard } from "@/features/proposals/components/ProposalWizard";

export default async function CreateProposalPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ mode?: string }>;
}) {
  // ดึง Project ID จาก URL (เช่น PRJ-ABCD123)
  const { id } = await params;
  const projectId = id;
  const query = await searchParams;
  const mode = query?.mode === "review" ? "submitted" : "draft";

  return (
    <div className="min-h-screen bg-[#f9f9ff] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#191c20] tracking-tight">
            จัดทำเอกสารรายละเอียดประกอบการพิจารณาโครงการเสนอคณะกรรมการดิจิทัลกรุงเทพมหานคร
          </h1>
          <p className="text-[#3f4942] mt-1">
            รหัสอ้างอิงโครงการ: <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#D1CDC7] text-xs">{projectId}</span>
          </p>
        </div>

        <CreateProposalWizard projectId={projectId} mode={mode} />

      </div>
    </div>
  );
}
