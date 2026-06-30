// src/app/(protected)/projects/[id]/page.tsx
// Project Workspace — Tab-based Enterprise UI (Orchestrator)
"use client";

import { useParams } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useProjectWorkspace } from "@/features/projects/hooks/useProjectWorkspace";
import { useWorkspaceTabs } from "@/features/projects/hooks/useWorkspaceTabs";
import { ProjectHeader } from "@/features/projects/components/workspace/ProjectHeader";
import { WorkspaceTabsList } from "@/features/projects/components/workspace/WorkspaceTabsList";
import { ProposalTabContent } from "@/features/projects/components/workspace/ProposalTabContent";
import { DocumentsTabContent } from "@/features/projects/components/workspace/DocumentsTabContent";
import { TimelineTabContent } from "@/features/projects/components/workspace/TimelineTabContent";

export default function ProjectWorkspacePage() {
  const params = useParams();
  const projectId = params.id as string;

  const { projectDetail } = useProjectWorkspace(projectId);
  const { activeTab, setActiveTab } = useWorkspaceTabs(projectDetail.hasProposal);

  return (
    <div className="flex flex-col h-full p-4 sm:p-6 lg:p-8 mx-auto w-full animate-in fade-in duration-500">
      <ProjectHeader project={projectDetail} />

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
        className="flex-1 flex flex-col"
      >
        <WorkspaceTabsList />

        <TabsContent value="tab-proposal" className="flex-1 mt-0">
          <ProposalTabContent project={projectDetail} />
        </TabsContent>

        <TabsContent value="tab-documents" className="flex-1 mt-0">
          <DocumentsTabContent />
        </TabsContent>

        <TabsContent value="tab-timeline" className="flex-1 mt-0">
          <TimelineTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
