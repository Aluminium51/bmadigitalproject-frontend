// src/app/test-doc/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { generateProjectDocx } from "@/lib/documentGenerator";

// จำลองข้อมูล (Mock Data) ให้ครบตาม Schema
const mockProjectData = {
  // --- Step 1 ---
  projectName: "โครงการพัฒนาระบบบริหารจัดการข้อมูลอัจฉริยะ (Smart Data Management)",
  agencyName: "สำนักยุทธศาสตร์และประเมินผล",
  headOfAgency: "นายสมชาย ใจดี",
  dcioName: "นางสาวสมหญิง รักงาน",
  projectManager: "นายวิศวกร เก่งกาจ",
  totalBudget: 15000000,
  budgetsByYear: [
    { year: "2567", amount: 5000000, budgetType: "งบลงทุน" },
    { year: "2568", amount: 10000000, budgetType: "งบดำเนินงาน" },
  ],

  // --- Step 2 ---
  background: "สำนักงานควบคุมอาคาร สำนักการโยธา กรุงเทพมหานคร เป็นหน่วยงานที่ดูแลเกี่ยวกับการอนุญาต...",
  objective: "1. เพื่อเพิ่มประสิทธิภาพการทำงาน\n\t2. เพื่อลดกระดาษ (Paperless)",
  target: "หน่วยงานในสังกัด กทม. จำนวน 50 เขต",
  scope: "พัฒนาระบบ Web Application และ Mobile Application สำหรับเจ้าหน้าที่",
  projectType: "ทดแทนระบบเดิม",
  relatedProjects: [
    { projectName: "โครงการติดตั้ง Cloud", agency: "สยป.", fiscalYear: "2566", relationType: "ระบบโครงสร้างพื้นฐาน", remark: "ติดตั้ง Cloud เพื่อรองรับระบบใหม่" },
    { projectName: "โครงการอบรมทักษะดิจิทัล", agency: "สยป.", fiscalYear: "2567", relationType: "พัฒนาบุคลากร" }
  ],
  currentSystemStatus: "ใช้งานระบบฐานข้อมูลแบบเก่า (On-Premise) ซึ่งมีอายุเกิน 10 ปี",
  currentProblems: "ระบบล่มบ่อยครั้ง ค้นหาข้อมูลช้า และไม่รองรับการทำงานผ่านมือถือ",
  manpower: [
    { agencyPart: "ฝ่ายเทคโนโลยี", positionLimit: 10, occupied: 8, vacant: 2 }
  ],
  existingEquipment: [
    { itemName: "Server รุ่นเก่า", ageYears: 8, quantity: 2, user: "ฝ่าย IT", location: "ห้อง Data Center", remark: "หมดประกันแล้ว" },
    { itemName: "เครื่องคอมพิวเตอร์", ageYears: 5, quantity: 20, user: "เจ้าหน้าที่", location: "สำนักงาน"},
    { itemName: "เครื่องพิมพ์", ageYears: 6, quantity: 5, user: "เจ้าหน้าที่", location: "สำนักงาน", remark: "ใช้บ่อย" }
  ],

  // --- Step 3 (🟢 อัปเดตโครงสร้างใหม่ที่นี่) ---
  isBmaPlan: false,
  isAgencyPlan: true,
  agencyStrategy: "การบริหารจัดการเมือง",
  agencyIssue: "การให้บริการประชาชนแบบดิจิทัล",
  agencyKpi: "ร้อยละของกระบวนการที่ลดการใช้กระดาษ",
  
  isGovernorPolicy: true,
  governorPolicyCode: "05-02",
  governorPolicyName: "บริหารจัดการดี โปร่งใส",

  obstacleLaws: "ไม่มีอุปสรรคทางข้อกฎหมาย",
  appArchitecture: "ใช้สถาปัตยกรรมแบบ Microservices และเชื่อมต่อผ่าน API Gateway",
  dataOwner: "สำนักยุทธศาสตร์และประเมินผล (สยป.)",
  dataExchangePlan: "เชื่อมโยงข้อมูลกับกระทรวงมหาดไทยผ่านระบบ Linkage Center",

  // --- Step 4 ---
  hardwareCosts: [
    { itemName: "เครื่องคอมพิวเตอร์แม่ข่าย (Server)", quantity: 2, unitPrice: 500000, reference: "เกณฑ์ ICT" }
  ],
  softwareCosts: [
    { itemName: "ระบบปฏิบัติการ Windows Server", quantity: 2, unitPrice: 50000, reference: "ราคาตลาด" }
  ],
  personnelCosts: [
    { roleLevel: "บุคลากรหลัก", position: "System Analyst", baseSalary: 50000, multiplier: 1.5, personCount: 2, durationMonths: 12 }
  ],
  otherCosts: [
    { itemName: "ค่าฝึกอบรมการใช้งานระบบ", quantity: 1, unitPrice: 100000, remark: "จัดอบรม 2 วัน" }
  ],

  // --- Step 5 ---
  operationDuration: 360,
  currentIctStaff: [
    { position: "นักวิชาการคอมพิวเตอร์", level: "ชำนาญการ", count: 3 }
  ],
  expectedBenefits: "1. ประชาชนได้รับบริการที่รวดเร็วขึ้น\n2. ลดงบประมาณการใช้กระดาษลง 50%",
  submitterName: "นายเสนอ โครงการ",
  submitterAgency: "กองสารสนเทศ สำนักยุทธศาสตร์ฯ",
  submitterPhone: "02-123-4567 ต่อ 89",
  submitterEmail: "test@bangkok.go.th",
};

// 🟢 อัปเดต Custom logic สำหรับแปลงข้อมูลก่อนหยอดลงใน Word
const currentType = mockProjectData.projectType;
const templateData = {
  ...mockProjectData,
  
  // Step 2: สร้างตัวแปรใหม่ 3 ตัว สำหรับช่อง Checkbox
  chkNew: currentType === "จัดหาใหม่" ? "☑" : "☐",
  chkReplace: currentType === "ทดแทนระบบเดิม" ? "☑" : "☐",
  chkPhase: currentType.includes("ต่อเนื่อง") ? "☑" : "☐", 

  // Step 2 (ต่อ): จัดการ table ของรายการที่เกี่ยวข้อง
  hasManpower: mockProjectData.manpower && mockProjectData.manpower.length > 0,
  hasEquipment: mockProjectData.existingEquipment && mockProjectData.existingEquipment.length > 0,

  // Step 3: แปลง Boolean เป็นติ๊กถูก (☑) หรือเว้นว่าง (☐)
  chkBma: mockProjectData.isBmaPlan ? "☑" : "☐",
  chkAgency: mockProjectData.isAgencyPlan ? "☑" : "☐",
  chkGov: mockProjectData.isGovernorPolicy ? "☑" : "☐",

  // Step 3 (ต่อ): จัดการ table ของโครงการที่เกี่ยวข้อง (ถ้าไม่มี ให้แสดงข้อความ "ไม่มีโครงการที่เกี่ยวข้อง")
  hasRelatedProjects: mockProjectData.relatedProjects && mockProjectData.relatedProjects.length > 0,
  
  // Step 3: ถ้าไม่ได้ติ๊ก ให้แสดงจุดไข่ปลา หรือคำว่า "ไม่มี"
  agencyStrategy: mockProjectData.isAgencyPlan ? mockProjectData.agencyStrategy : "..........................",
  agencyIssue: mockProjectData.isAgencyPlan ? mockProjectData.agencyIssue : "..........................",
  agencyKpi: mockProjectData.isAgencyPlan ? mockProjectData.agencyKpi : "..........................",
  
  governorPolicyCode: mockProjectData.isGovernorPolicy ? mockProjectData.governorPolicyCode : "..........................",
  governorPolicyName: mockProjectData.isGovernorPolicy ? mockProjectData.governorPolicyName : "..........................",
};

export default function TestDocPage() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTestDownload = async () => {
    setIsGenerating(true);
    try {
      await generateProjectDocx(templateData as any);
      console.log("Mock Data ที่ส่งไปทำ Word:", templateData);
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการสร้างเอกสาร");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low p-8 flex items-center justify-center">
      <div className="bg-surface p-8 rounded-xl shadow-sm border border-border max-w-2xl w-full">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-primary-container p-4 rounded-full">
            <FileText className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            เครื่องมือทดสอบการสร้างเอกสาร Word
          </h1>
          <p className="text-muted-foreground">
            ทดสอบการนำ Mock Data ทั้ง 5 Steps หยอดลงในไฟล์ Template (<code>public/templates/project-proposal.docx</code>)
          </p>
          
          <div className="w-full bg-surface-variant p-4 rounded-md text-left overflow-hidden h-32 mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-variant z-10 pointer-events-none" />
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap opacity-70">
              {JSON.stringify(templateData, null, 2)}
            </pre>
          </div>

          <Button 
            onClick={handleTestDownload} 
            disabled={isGenerating}
            size="lg"
            className="gap-2 w-full sm:w-auto"
          >
            {isGenerating ? (
              "กำลังสร้างเอกสาร..."
            ) : (
              <>
                <Download className="w-5 h-5" />
                ดาวน์โหลดไฟล์ทดสอบ (.docx)
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}