import { ProposalFormValues } from "./types"; // ดึง Type ของ Database/Backend มาใช้

// Type นี้คือ "หน้าตา" ของข้อมูลที่ Word Template คาดหวังจะได้เป๊ะๆ
export interface ProposalTemplateData extends Partial<ProposalFormValues> {
  // Checkboxes
  chkNew: string;
  chkReplace: string;
  chkPhase: string;
  chkBma: string;
  chkAgency: string;
  chkGov: string;

  // Conditional Arrays Flags
  hasManpower: boolean;
  hasEquipment: boolean;
  hasRelatedProjects: boolean;
  hasHardwareCosts: boolean;
  hasSoftwareCosts: boolean;

  // Placeholder Strings
  agencyStrategyStr: string;
  agencyIssueStr: string;
  agencyKpiStr: string;
  governorPolicyCodeStr: string;
  governorPolicyNameStr: string;

  // Formatted Arrays
  hardwareCostsFormatted: any[];
  softwareCostsFormatted: any[];
}