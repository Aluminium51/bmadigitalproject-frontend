import { useState } from "react";
import type { ProjectDetail } from "../types/workspace";

export function useProjectWorkspace(projectId: string) {
  const [projectDetail] = useState<ProjectDetail>({
    id: projectId,
    projectCode: "BMA-69-0001",
    name: "โครงการพัฒนาระบบสารสนเทศบริหารจัดการข้อมูลภายในองค์กร",
    agency: "สำนักการแพทย์",
    fiscalYear: 2569,
    status: "Draft",
    hasProposal: false,
  });

  return { projectDetail };
}