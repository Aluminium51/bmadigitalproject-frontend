import {
  Clock,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle,
  Target,
  Layers,
  DollarSign,
  Users,
  Building2,
  Database,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ProjectDetail } from "../../types/workspace";
import { useProposalState } from "@/features/proposals/hooks/useProposalState";
import { useInitializeDraft } from "@/features/proposals/hooks/useProposalMutations";

// 1. ประกาศ Type สำหรับ Proposal ให้ตรงกับฟิลด์ที่มีการเรียกใช้ใน Component
export interface SubmitProposalDTO {
  agencyName: string;
  headOfAgency: string;
  dcioName: string;
  projectManager: string;
  background: string;
  objective: string;
  scope: string;
  target: string;
  currentSystemStatus: string;
  currentProblems: string;
  isGovernorPolicy: boolean;
  governorPolicyName?: string;
  governorPolicyCode?: string;
  isAgencyPlan: boolean;
  agencyStrategy?: string;
  agencyKpi?: string;
  expectedBenefits: string;
  appArchitecture?: string;
  dataOwner?: string;
  dataExchangePlan?: string;
  totalBudget: number;
  budgetsByYear?: { year: string | number; amount: number; budgetType: string }[];
  durationDays: number;
  ictPersonnel?: { position: string; level: string; count: number }[];
  otherReadiness?: string;
}

interface ProposalTabContentProps {
  project: ProjectDetail;
}

export function ProposalTabContent({ project }: ProposalTabContentProps) {
  const projectId = String(project.id);
  const router = useRouter();
  const proposalState = useProposalState(projectId);
  const { mutate: initializeDraft, isPending: isCreatingDraft } = useInitializeDraft(projectId);

  if (proposalState.status === "loading") {
    return (
      <div className="flex min-h-48 items-center justify-center text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading proposal...
      </div>
    );
  }

  if (proposalState.status === "error") {
    return <p className="rounded-md border border-red-200 bg-red-50 p-6 text-red-700">Unable to load proposal.</p>;
  }

  if (proposalState.status === "draft") {
    return (
      <Card className="rounded-md border-orange-200 bg-orange-50/50 shadow-sm">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="font-extrabold text-[#191c20] text-lg">เอกสารรายละเอียดประกอบการพิจารณาโครงการ กำลังอยู่ในระหว่างการเขียน</h3>
            <p className="text-sm text-slate-600 mt-1">กรุณาดำเนินการต่อให้เสร็จสิ้น เพื่อยื่นเรื่องส่งโครงการ</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push(`/projects/${projectId}/proposal/create`)}
            className="font-bold gap-2 rounded-md px-6 h-12 w-full md:w-auto"
          >
            Continue Proposal Draft
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  const proposal = proposalState.status === "submitted"
    ? (proposalState.data as unknown as SubmitProposalDTO)
    : null;

  // 2. นำเงื่อนไข !proposal กลับมา เพื่อให้ TypeScript มั่นใจว่าด้านล่างจะมีค่า proposal แน่นอน
  if (!proposal) {
    return (
      <Card className="rounded-md border-orange-200 bg-orange-50/50 shadow-sm">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="size-12 bg-white text-status-orange rounded-md shrink-0 flex items-center justify-center shadow-sm border border-orange-200">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#191c20] text-lg">
                ยังไม่มีแบบร่างเอกสารรายละเอียดประกอบการพิจารณาโครงการ
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                กรุณากรอกรายละเอียดโครงการทั้ง 5 หมวดหลัก เพื่อใช้ในการพิจารณาอนุมัติ
              </p>
            </div>
          </div>
          <Button
            disabled={isCreatingDraft}
            onClick={() =>
              initializeDraft(undefined, {
                onSuccess: () => {
                  router.push(`/projects/${projectId}/proposal/create`);
                },
              })
            }
            className="font-bold bg-status-orange hover:bg-[#d65f00] text-white rounded-md px-8 h-12 shadow-sm shrink-0 w-full md:w-auto transition-all active:scale-95"
          >
            เริ่มต้นสร้างแบบร่าง
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // 3. เอา Comment ออก เพื่อให้สามารถคำนวณ totalBudgetInMillions นำไปแสดงผลได้
  const formatCurrency = (amount: number) => new Intl.NumberFormat('th-TH').format(amount);
  const totalBudgetInMillions = (proposal.totalBudget / 1000000).toFixed(2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* 1. ข้อมูลเบื้องต้น (แสดงเต็มความกว้าง) */}
      <Card className="rounded-md border-[#D1CDC7] shadow-sm lg:col-span-2">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 rounded-md border border-slate-200">
              <Building2 className="w-4 h-4 text-slate-600" />
            </div>
            <h3 className="font-bold text-[#191c20]">ข้อมูลองค์กรและผู้รับผิดชอบ</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-sm text-[#3f4942]">
            <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">หน่วยงานที่เสนอ</span>
              <span className="font-medium">{proposal.agencyName}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">หัวหน้าหน่วยงาน</span>
              <span className="font-medium">{proposal.headOfAgency}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">DCIO</span>
              <span className="font-medium">{proposal.dcioName}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">ผู้จัดการโครงการ</span>
              <span className="font-medium">{proposal.projectManager}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. หลักการและเหตุผล (แสดงเต็มความกว้างเพราะเนื้อหาเยอะ) */}
      <Card className="rounded-md border-[#D1CDC7] shadow-sm lg:col-span-2">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 rounded-md border border-blue-200">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-bold text-[#191c20]">รายละเอียดและขอบเขตโครงการ</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#3f4942]">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">ความเป็นมา</p>
              <p className="leading-relaxed bg-slate-50 rounded-md p-3 border border-slate-100 whitespace-pre-wrap">
                {proposal.background}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">วัตถุประสงค์</p>
              <p className="leading-relaxed bg-slate-50 rounded-md p-3 border border-slate-100 whitespace-pre-wrap">
                {proposal.objective}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">ขอบเขต (Scope) & เป้าหมาย</p>
              <div className="bg-slate-50 rounded-md p-3 border border-slate-100 space-y-2">
                <p><strong>ขอบเขต:</strong> {proposal.scope}</p>
                <p><strong>กลุ่มเป้าหมาย:</strong> {proposal.target}</p>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">สภาพปัจจุบันและปัญหา</p>
              <div className="bg-slate-50 rounded-md p-3 border border-slate-100 space-y-2">
                <p><strong>ระบบเดิม:</strong> {proposal.currentSystemStatus}</p>
                <p><strong>ปัญหา:</strong> {proposal.currentProblems}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. ความสอดคล้องกับยุทธศาสตร์ */}
      <Card className="rounded-md border-[#D1CDC7] shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-violet-50 rounded-md border border-violet-200">
              <Layers className="w-4 h-4 text-violet-600" />
            </div>
            <h3 className="font-bold text-[#191c20]">ความสอดคล้องยุทธศาสตร์</h3>
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            {proposal.isGovernorPolicy && (
              <div className="flex items-start gap-2.5 bg-slate-50 rounded-md p-3 border border-slate-100">
                <CheckCircle className="w-4 h-4 text-[#00734b] shrink-0 mt-0.5" />
                <span className="text-[#3f4942]">
                  <strong>นโยบายผู้ว่าฯ:</strong> {proposal.governorPolicyName} ({proposal.governorPolicyCode})
                </span>
              </div>
            )}
            {proposal.isAgencyPlan && proposal.agencyStrategy && (
              <div className="flex items-start gap-2.5 bg-slate-50 rounded-md p-3 border border-slate-100">
                <CheckCircle className="w-4 h-4 text-[#00734b] shrink-0 mt-0.5" />
                <div className="text-[#3f4942]">
                  <p><strong>ยุทธศาสตร์หน่วยงาน:</strong> {proposal.agencyStrategy}</p>
                  <p className="text-xs text-slate-500 mt-1">ตัวชี้วัด: {proposal.agencyKpi}</p>
                </div>
              </div>
            )}
            {proposal.expectedBenefits && (
              <div className="flex items-start gap-2.5 bg-slate-50 rounded-md p-3 border border-slate-100">
                <CheckCircle className="w-4 h-4 text-[#00734b] shrink-0 mt-0.5" />
                <span className="text-[#3f4942]"><strong>ผลที่คาดว่าจะได้รับ:</strong> {proposal.expectedBenefits}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 4. สถาปัตยกรรมและข้อมูล (Tech & Data) */}
      <Card className="rounded-md border-[#D1CDC7] shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 rounded-md border border-indigo-200">
              <Database className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="font-bold text-[#191c20]">สถาปัตยกรรมและข้อมูล</h3>
          </div>
          <Separator />
          <div className="space-y-3 text-sm text-[#3f4942]">
            <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">สถาปัตยกรรมระบบ</p>
              <p>{proposal.appArchitecture || "-"}</p>
            </div>
            <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">เจ้าของข้อมูล (Data Owner)</p>
              <p>{proposal.dataOwner || "-"}</p>
            </div>
            <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">แผนการแลกเปลี่ยนข้อมูล</p>
              <p>{proposal.dataExchangePlan || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. สรุปงบประมาณ */}
      <Card className="rounded-md border-[#D1CDC7] shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 rounded-md border border-emerald-200">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="font-bold text-[#191c20]">แผนงบประมาณ</h3>
          </div>
          <Separator />

          <div className="bg-emerald-50 rounded-md p-4 border border-emerald-100 text-center mb-3">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
              งบประมาณรวมทั้งสิ้น
            </p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">
              {totalBudgetInMillions}
            </p>
            <p className="text-[10px] text-emerald-600">ล้านบาท ({formatCurrency(proposal.totalBudget)} บาท)</p>
          </div>

          {proposal.budgetsByYear && proposal.budgetsByYear.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {proposal.budgetsByYear.map((b, i) => (
                <div key={i} className="bg-slate-50 rounded-md p-3 border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ปี {b.year}</p>
                  <p className="text-lg font-bold text-[#191c20]">
                    {(b.amount / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-[10px] text-slate-400">{b.budgetType}</p>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-sm text-slate-400 text-center py-2">- ไม่ได้ระบุแผนรายปี -</p>
          )}
        </CardContent>
      </Card>

      {/* 6. ความพร้อมด้านบุคลากรและแผนงาน */}
      <Card className="rounded-md border-[#D1CDC7] shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 rounded-md border border-amber-200">
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="font-bold text-[#191c20]">ความพร้อมและบุคลากร</h3>
          </div>
          <Separator />
          <div className="space-y-3 text-sm text-[#3f4942]">
            <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">ระยะเวลาดำเนินการ</p>
              <p>{proposal.durationDays} วัน</p>
            </div>
            <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">บุคลากรด้าน ICT ที่รับผิดชอบ</p>
              {proposal.ictPersonnel && proposal.ictPersonnel.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {proposal.ictPersonnel.map((person, idx) => (
                    <li key={idx}>
                      {person.position} ({person.level}) - {person.count} คน
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400">- ไม่ได้ระบุข้อมูล -</p>
              )}
            </div>
            <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">ความพร้อมด้านอื่นๆ (เช่น อุปกรณ์)</p>
              <p>{proposal.otherReadiness || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
