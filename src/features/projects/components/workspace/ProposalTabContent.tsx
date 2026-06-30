import { useRouter } from "next/navigation";
import {
  Clock,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle,
  Target,
  Layers,
  DollarSign,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ProjectDetail } from "../../types/workspace";

interface ProposalTabContentProps {
  project: ProjectDetail;
}

export function ProposalTabContent({ project }: ProposalTabContentProps) {
  const router = useRouter();

  if (!project.hasProposal) {
    return (
      <Card className="rounded-md border-orange-200 bg-orange-50/50 shadow-sm">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="size-12 bg-white text-status-orange rounded-md shrink-0 flex items-center justify-center shadow-sm border border-orange-200">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#191c20] text-lg">
                ขั้นตอนถัดไป: จัดทำข้อเสนอโครงการ (Proposal)
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                กรุณากรอกรายละเอียดโครงการทั้ง 5 หมวดหลัก เพื่อใช้ในการพิจารณาอนุมัติ
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push(`/projects/${project.id}/proposal/create`)}
            className="font-bold gap-2 bg-status-orange hover:bg-[#d65f00] text-white rounded-md px-8 h-12 shadow-sm shrink-0 w-full md:w-auto transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-5 h-5" />
            เริ่มเขียนแบบฟอร์ม
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="rounded-md border-[#D1CDC7] shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 rounded-md border border-blue-200">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-bold text-[#191c20]">หลักการและเหตุผล</h3>
          </div>
          <Separator />
          <div className="space-y-3 text-sm text-[#3f4942]">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                วัตถุประสงค์
              </p>
              <p className="leading-relaxed bg-slate-50 rounded-md p-3 border border-slate-100">
                เพื่อพัฒนาระบบสารสนเทศสำหรับบริหารจัดการข้อมูลภายในองค์กรให้มีประสิทธิภาพ
                ลดขั้นตอนการทำงานซ้ำซ้อน
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                หลักการ
              </p>
              <p className="leading-relaxed bg-slate-50 rounded-md p-3 border border-slate-100">
                สนับสนุนนโยบายรัฐบาลดิจิทัลและแผนยุทธศาสตร์ด้านเทคโนโลยีสารสนเทศของกรุงเทพมหานคร
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-md border-[#D1CDC7] shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-violet-50 rounded-md border border-violet-200">
              <Layers className="w-4 h-4 text-violet-600" />
            </div>
            <h3 className="font-bold text-[#191c20]">ความสอดคล้องกับยุทธศาสตร์</h3>
          </div>
          <Separator />
          <div className="space-y-2 text-sm">
            {[
              "ยุทธศาสตร์ที่ 1: การพัฒนาระบบดิจิทัลภาครัฐ",
              "เป้าประสงค์: เพิ่มประสิทธิภาพการบริหารจัดการ",
              "ตัวชี้วัด: ลดระยะเวลาดำเนินการ 30%",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 bg-slate-50 rounded-md p-3 border border-slate-100"
              >
                <CheckCircle className="w-4 h-4 text-[#00734b] shrink-0 mt-0.5" />
                <span className="text-[#3f4942]">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-md border-[#D1CDC7] shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 rounded-md border border-emerald-200">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="font-bold text-[#191c20]">สรุปงบประมาณ</h3>
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-md p-4 border border-blue-100 text-center">
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                งบ IT
              </p>
              <p className="text-xl font-extrabold text-blue-700 mt-1">12.5</p>
              <p className="text-[10px] text-blue-500">ล้านบาท</p>
            </div>
            <div className="bg-amber-50 rounded-md p-4 border border-amber-100 text-center">
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                งบ HR
              </p>
              <p className="text-xl font-extrabold text-amber-700 mt-1">3.2</p>
              <p className="text-[10px] text-amber-500">ล้านบาท</p>
            </div>
            <div className="bg-emerald-50 rounded-md p-4 border border-emerald-100 text-center">
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                รวมทั้งหมด
              </p>
              <p className="text-xl font-extrabold text-emerald-700 mt-1">15.7</p>
              <p className="text-[10px] text-emerald-500">ล้านบาท</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-md border-[#D1CDC7] shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 rounded-md border border-amber-200">
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="font-bold text-[#191c20]">ความพร้อมด้านบุคลากรและแผนงาน</h3>
          </div>
          <Separator />
          <div className="space-y-3 text-sm text-[#3f4942]">
            <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                ทีมงานที่รับผิดชอบ
              </p>
              <p>
                ฝ่ายพัฒนาระบบสารสนเทศ จำนวน 8 คน (เจ้าหน้าที่ IT 5 คน, ผู้ประสานงาน 3 คน)
              </p>
            </div>
            <div className="bg-slate-50 rounded-md p-3 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                ระยะเวลาดำเนินการ
              </p>
              <p>12 เดือน (ตุลาคม 2568 – กันยายน 2569)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
