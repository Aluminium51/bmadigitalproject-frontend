export type DocumentFile = {
  id: string;
  name: string;
  type: "pdf" | "ppt" | "image" | "other";
  size?: string;
  url?: string;
};

export type ProjectDetail = {
  id: string;
  name: string;
  agency: string;
  fiscalYear: number;
  status: string;
  hasProposal: boolean;
};

export type WorkspaceTab = "tab-proposal" | "tab-documents" | "tab-timeline";
