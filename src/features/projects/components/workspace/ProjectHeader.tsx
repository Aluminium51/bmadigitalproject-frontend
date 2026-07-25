// src/features/projects/components/workspace/ProjectHeader.tsx
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Building2, CalendarDays, Send, Briefcase, Target } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProjectDetail } from "../../types/workspace";

// 1. นำเข้า Hook สำหรับดึงข้อมูล Lookup ของจริง
import { useFourQuadrants, useDeputyGovernors } from "@/features/lookups/hooks/useLookups";
import { useProposalState } from "@/features/proposals/hooks/useProposalState";
import { useGetDraft } from "@/features/proposals/hooks/useProposalDraftQuery";
import { useSubmitProposal } from "@/features/proposals/hooks/useProposalMutations";
import { useDeleteProject } from "../../hooks/useProjectMutations";
import {
  getProjectStatusMeta,
} from "../../utils/projectStatus";
import { ReturnedFeedbackBanner } from "./ReturnedFeedbackBanner";

interface ProjectHeaderProps {
  project: ProjectDetail;
  proposal?: any; // เผื่อรับข้อมูล Proposal เข้ามาเพื่อดึงปีงบประมาณ
}

export function ProjectHeader({ project, proposal }: ProjectHeaderProps) {
  const router = useRouter();
  const projectId = String(project.id);
  const proposalState = useProposalState(projectId);
  const { data: currentDraft, isLoading: isDraftLoading } = useGetDraft(projectId);
  const { mutate: submitProposal, isPending: isSubmitting } = useSubmitProposal(projectId);
  const deleteMutation = useDeleteProject(projectId);
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const canSubmitProposal = project.permissions?.canSubmitProposal === true;
  const isSubmitDisabled = isDraftLoading || isSubmitting || !currentDraft || !canSubmitProposal;
  const statusMeta = getProjectStatusMeta(project.projectStatusId, project.status?.name);

  const handleSubmit = () => {
    if (!currentDraft) {
      toast.error("ไม่สามารถส่งโครงการได้", {
        description: "The current draft is still loading. Please try again.",
      });
      return;
    }
    setSubmitConfirmOpen(true);
  };

  const confirmSubmit = () => {
    if (!currentDraft) return;

    submitProposal(currentDraft, {
      onSuccess: () => {
        setSubmitConfirmOpen(false);
      },
      onError: (error) => {
        toast.error("ไม่สามารถส่งโครงการได้", {
          // description: error instanceof Error ? error.message : "Please try again.",
          description: error instanceof Error ? error.message : "Please try again.",
        });
      },
    });
  };

  // 2. เรียกใช้ Hook ดึงข้อมูลจาก API
  const { data: quadrantsRes } = useFourQuadrants();
  const { data: governorsRes } = useDeputyGovernors();

  // ดึง Array ออกมา (ถ้าข้อมูลกำลังโหลดอยู่ จะได้เป็น Array เปล่าไปก่อน)
  const quadrants = quadrantsRes?.data || [];
  const governors = governorsRes?.data || [];

  // 3. ดึงชื่อหน่วยงานจาก Object `division`
  const agencyName = project.division?.departmentName
    ? `${project.division.departmentName} (${project.division.name})`
    : (project.division?.name || "-");

  // 4. เทียบ ID ที่ได้จาก Project เข้ากับข้อมูล Lookup ของจริงเพื่อเอา `name` มาโชว์
  const matchedGovernor = governors.find((g: any) => g.id === project.deputyGovernorId);
  const deputyGovernorName = project.deputyGovernorId
    ? matchedGovernor?.name || `(ID: ${project.deputyGovernorId})`
    : "ยังไม่ระบุ";

  const matchedQuadrant = quadrants.find((q: any) => q.id === project.fourQuadrantsId);
  const fourQuadrantsName = project.fourQuadrantsId
    ? matchedQuadrant?.name || `(ID: ${project.fourQuadrantsId})`
    : "ยังไม่ระบุ";

  // 5. ดึงปีงบประมาณจาก Proposal (ถ้ายื่นแล้ว) ถ้าไม่มีให้แสดงว่า "ยังไม่ระบุ"
  const fiscalYear = proposal?.budgetsByYear?.[0]?.year
    ? `พ.ศ. ${proposal.budgetsByYear[0].year}`
    : "ยังไม่ระบุ";

  return (
    <div className="space-y-4 mb-6">
      <button
        onClick={() => router.push("/projects")}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#00734b] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> กลับไปหน้ารวมโครงการ
      </button>

      <Card className="rounded-md border-[#D1CDC7] shadow-sm bg-white">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
            <div className="space-y-4 min-w-0 flex-1">

              {/* --- Badge Status & Project Code --- */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={`${statusMeta.className} font-bold text-[11px] px-2.5 py-0.5 rounded-md`}
                >
                  {statusMeta.label}
                </Badge>
                <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  {project.projectCode || "รอการสร้างรหัส"}
                </span>
              </div>

              {/* --- Project Name --- */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#191c20] tracking-tight leading-snug wrap-break-words">
                {project.projectName || "ไม่มีชื่อโครงการ"}
              </h1>

              {/* --- Strategic Metadata --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
                {/* 1. หน่วยงาน */}
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    หน่วยงานที่รับผิดชอบ
                  </p>
                  <div className="flex items-center gap-2 font-medium text-[#191c20] text-sm">
                    <div className="p-1.5 bg-[#00734b]/10 rounded-md shrink-0">
                      <Building2 className="w-4 h-4 text-[#00734b]" />
                    </div>
                    <span className="truncate" title={agencyName}>
                      {agencyName}
                    </span>
                  </div>
                </div>

                {/* 2. รองผู้ว่าฯ */}
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    ผู้บริหารที่กำกับดูแล
                  </p>
                  <div className="flex items-center gap-2 font-medium text-[#191c20] text-sm">
                    <div className="p-1.5 bg-[#00734b]/10 rounded-md shrink-0">
                      <Briefcase className="w-4 h-4 text-[#00734b]" />
                    </div>
                    <span className="truncate" title={deputyGovernorName}>
                      {deputyGovernorName}
                    </span>
                  </div>
                </div>

                {/* 3. 4 Quadrants Model */}
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    4 Quadrants Model
                  </p>
                  <div className="flex items-center gap-2 font-medium text-[#191c20] text-sm">
                    <div className="p-1.5 bg-[#00734b]/10 rounded-md shrink-0">
                      <Target className="w-4 h-4 text-[#00734b]" />
                    </div>
                    <span className="truncate" title={fourQuadrantsName}>
                      {fourQuadrantsName}
                    </span>
                  </div>
                </div>

                {/* 4. ปีงบประมาณ */}
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    ปีงบประมาณ
                  </p>
                  <div className="flex items-center gap-2 font-medium text-[#191c20] text-sm">
                    <div className="p-1.5 bg-[#00734b]/10 rounded-md shrink-0">
                      <CalendarDays className="w-4 h-4 text-[#00734b]" />
                    </div>
                    {fiscalYear}
                  </div>
                </div>
              </div>
            </div>

            {/* --- Single explicit final-submission action --- */}
            <div className="flex flex-col items-stretch gap-2 shrink-0 xl:self-start w-full xl:w-auto">
              {proposalState.status === "draft" && canSubmitProposal && (
                <Button
                  disabled={isSubmitDisabled}
                  onClick={handleSubmit}
                  className="gap-2 bg-primary hover:bg-primary-dark text-white rounded-xl px-6 h-11 font-bold shadow-sm w-full xl:w-auto transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "กำลังส่ง..." : "ส่งโครงการเข้าสู่การพิจารณา"}
                </Button>
              )}
              {project.permissions?.canDelete && (
                <Button
                  variant="outline"
                  disabled={deleteMutation.isPending}
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="h-10 w-full xl:w-auto border-red-200 text-red-700 hover:bg-red-50 rounded-xl"
                >
                  {deleteMutation.isPending ? "กำลังลบโครงการ..." : "ลบโครงการ"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ReturnedFeedbackBanner project={project} />

      <AlertDialog open={submitConfirmOpen} onOpenChange={setSubmitConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit this project?</AlertDialogTitle>
            <AlertDialogDescription>
              Submission finalizes the proposal and sends it into the review workflow. You will not be able to edit it unless it is returned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              {project.projectStatusId === 1
                ? "This draft will be permanently deleted together with its draft data and attachments."
                : "This project will be archived and removed from active views while preserving its historical records."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                setDeleteConfirmOpen(false);
                deleteMutation.mutate(undefined, {
                  onError: (error) => toast.error("Unable to delete project", { description: error instanceof Error ? error.message : "Please try again." }),
                });
              }}
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
