// src/features/projects/hooks/useProjects.ts
import { useState } from "react";
import { myDraftProjects, myActiveProjects, teamProjects, otherDepartmentProjects } from "../data/mock-projects";

export type TabType = "drafts" | "active" | "team" | "all";

export function useProjects() {
  const [activeTab, setActiveTab] = useState<TabType>("drafts");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery(""); 
  };

  const getActiveData = () => {
    let dataset: any[] = []; 

    if (activeTab === "drafts") dataset = myDraftProjects;
    else if (activeTab === "team") dataset = teamProjects;
    else if (activeTab === "active") {
      dataset = [...myActiveProjects].sort((a, b) => {
        if (a.status === "Need Revision" && b.status !== "Need Revision") return -1;
        if (a.status !== "Need Revision" && b.status === "Need Revision") return 1;
        return 0;
      });
    }
    else if (activeTab === "all") {
      const mySubmitted = myActiveProjects.map(p => ({ ...p, agency: "สำนักยุทธศาสตร์และประเมินผล" }));
      const teamSubmitted = teamProjects.filter(p => p.status !== "Draft").map(p => ({ ...p, agency: "สำนักยุทธศาสตร์และประเมินผล" }));
      dataset = [...mySubmitted, ...teamSubmitted, ...otherDepartmentProjects];
    }

    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      dataset = dataset.filter(p => 
        (p.name && p.name.toLowerCase().includes(lowerQuery)) || 
        (p.id && p.id.toLowerCase().includes(lowerQuery))
      );
    }

    return dataset;
  };

  const currentDataset = getActiveData();
  const totalPages = Math.ceil(currentDataset.length / itemsPerPage) || 1;
  const paginatedData = currentDataset.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return {
    activeTab, handleTabChange,
    searchQuery, setSearchQuery,
    currentPage, setCurrentPage, totalPages,
    paginatedData,
    draftsCount: myDraftProjects.length,
    activeCount: myActiveProjects.length
  };
}