import { z } from "zod";

// ---------------------------------------------------------------------------
// Step 1: ข้อมูลเบื้องต้นและภาพรวม (General Information)
// ---------------------------------------------------------------------------
export const projectStep1Schema = z.object({
  projectName: z.string().min(5, "กรุณาระบุชื่อโครงการอย่างน้อย 5 ตัวอักษร"),
  agencyName: z.string().min(2, "กรุณาระบุชื่อหน่วยงาน"),
  headOfAgency: z.string().min(2, "กรุณาระบุหัวหน้าส่วนราชการ"),
  dcioName: z.string().min(2, "กรุณาระบุ DCIO"),
  projectManager: z.string().min(2, "กรุณาระบุผู้รับผิดชอบโครงการ"),
  totalBudget: z.coerce.number().min(1, "กรุณาระบุวงเงินงบประมาณ"),
  // ตารางงบประมาณรายปี
  budgetsByYear: z.array(
    z.object({
      year: z.string().min(4, "ระบุ พ.ศ."),
      amount: z.coerce.number().min(1, "ระบุจำนวนเงิน"),
      budgetType: z.string().min(1, "ระบุประเภทงบประมาณ"),
    })
  ).optional().default([]),
});

// ---------------------------------------------------------------------------
// Step 2: สาระสำคัญและขอบเขตโครงการ (Context & Scope)
// ---------------------------------------------------------------------------
export const projectStep2Schema = z.object({
  background: z.string().min(10, "กรุณาระบุความเป็นมา"),
  objective: z.string().min(10, "กรุณาระบุวัตถุประสงค์"),
  target: z.string().min(10, "กรุณาระบุเป้าหมาย"),
  scope: z.string().min(10, "กรุณาระบุขอบเขตการดำเนินงาน"),
  projectType: z.enum(["จัดหาใหม่", "ทดแทนระบบเดิม", "โครงการต่อเนื่อง"], "กรุณาเลือกลักษณะโครงการ"),
  currentSystemStatus: z.string().min(5, "อธิบายสถานภาพระบบงานปัจจุบัน"),
  currentProblems: z.string().min(5, "อธิบายสภาพปัญหาปัจจุบัน"),

  // array ของตารางโครงการที่เกี่ยวข้อง
  relatedProjects: z.array(
    z.object({
      projectName: z.string().min(1, "ระบุชื่อโครงการ"),
      agency: z.string().min(1, "ระบุหน่วยงาน"),
      fiscalYear: z.string().min(4, "ระบุปี พ.ศ."),
      relationType: z.string().min(1, "ระบุความเกี่ยวข้อง"),
      remark: z.string().optional(),
    })
  ).optional().default([]),

  // ตารางอัตรากำลัง (อนุญาตให้ว่างเปล่าได้)
  manpower: z.array(
    z.object({
      agencyPart: z.string().min(1, "ระบุส่วนราชการ"),
      positionLimit: z.coerce.number(),
      occupied: z.coerce.number(),
      vacant: z.coerce.number(),
    })
  ).optional().default([]),

  // ตารางครุภัณฑ์ที่มีอยู่ (อนุญาตให้ว่างเปล่าได้)
  existingEquipment: z.array(
    z.object({
      itemName: z.string().min(1, "ระบุรายการครุภัณฑ์"),
      ageYears: z.coerce.number(),
      quantity: z.coerce.number(),
      user: z.string().min(1, "ระบุผู้ใช้งาน"),
      location: z.string().min(1, "ระบุสถานที่ตั้ง"),
      remark: z.string().optional(),
    })
  ).optional().default([]),
});

// ---------------------------------------------------------------------------
// Step 3: สถาปัตยกรรมองค์กร (Enterprise Architecture)
// ---------------------------------------------------------------------------
export const projectStep3Schema = z.object({
  // ข้อ 1
  isBmaPlan: z.boolean().default(false),
  
  // ข้อ 2
  isAgencyPlan: z.boolean().default(false),
  agencyStrategy: z.string().optional(),
  agencyIssue: z.string().optional(),
  agencyKpi: z.string().optional(),
  
  // ข้อ 3
  isGovernorPolicy: z.boolean().default(false),
  governorPolicyCode: z.string().optional(),
  governorPolicyName: z.string().optional(),

  obstacleLaws: z.string().optional(),
  appArchitecture: z.string().min(5, "กรุณาอธิบายด้านระบบสารสนเทศ"),
  dataOwner: z.string().min(2, "กรุณาระบุหน่วยงานเจ้าของข้อมูล"),
  dataExchangePlan: z.string().min(5, "กรุณาอธิบายแนวทางการแลกเปลี่ยนข้อมูล"),
  systemDiagramFiles: z.array(z.any()).max(1, "อัปโหลดได้ 1 ไฟล์").optional().default([]),
  networkDiagramFiles: z.array(z.any()).max(1, "อัปโหลดได้ 1 ไฟล์").optional().default([]),
}).superRefine((data, ctx) => {
  // ตรวจสอบว่าต้องเลือกอย่างน้อย 1 ข้อ
  if (!data.isBmaPlan && !data.isAgencyPlan && !data.isGovernorPolicy) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "กรุณาเลือกความสอดคล้องเชิงยุทธศาสตร์อย่างน้อย 1 ข้อ",
      path: ["isBmaPlan"], // ชี้ error ไปที่ข้อแรกให้แสดงผล
    });
  }

  // ดักจับถ้าติ๊กข้อ 2 แต่ไม่กรอกข้อมูล
  if (data.isAgencyPlan) {
    if (!data.agencyStrategy?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "กรุณาระบุแผนงาน", path: ["agencyStrategy"] });
    }
    if (!data.agencyIssue?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "กรุณาระบุประเด็น", path: ["agencyIssue"] });
    }
    if (!data.agencyKpi?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "กรุณาระบุตัวชี้วัด", path: ["agencyKpi"] });
    }
  }

  // ดักจับถ้าติ๊กข้อ 3 แต่ไม่กรอกข้อมูล
  if (data.isGovernorPolicy) {
    if (!data.governorPolicyCode?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "กรุณาระบุรหัสนโยบาย", path: ["governorPolicyCode"] });
    }
    if (!data.governorPolicyName?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "กรุณาระบุนโยบาย", path: ["governorPolicyName"] });
    }
  }
});

// ---------------------------------------------------------------------------
// Step 4: แผนงานและรายละเอียดงบประมาณ (Budget Breakdown)
// ---------------------------------------------------------------------------
const hardwareCostSchema = z.object({
  itemName: z.string().min(1, "กรุณาระบุรายการ"),
  // แปลงค่าว่างเป็น 0 อัตโนมัติ แล้วดักด้วย .min(1)
  quantity: z.coerce.number().min(1, "กรุณาระบุจำนวน"),
  unitPrice: z.coerce.number().min(0, "ห้ามติดลบ"),
  reference: z.string().min(1, "กรุณาเลือกที่มา"),
});

const softwareCostSchema = z.object({
  itemName: z.string().min(1, "กรุณาระบุชื่อซอฟต์แวร์"),
  quantity: z.coerce.number().min(1, "กรุณาระบุจำนวน"),
  unitPrice: z.coerce.number().min(0, "ห้ามติดลบ"),
  reference: z.string().min(1, "กรุณาเลือกที่มา"),
});

// 1. Schema สำหรับ บุคลากรหลัก และ บุคลากรผู้ช่วย (บังคับสาขาและตัวคูณ)
const personnelCoreAndAsstSchema = z.object({
  position: z.string().min(1, "ระบุตำแหน่ง"),
  degree: z.string().min(1, "ระบุวุฒิ"),
  fieldOfStudy: z.string().min(1, "ระบุสาขา"), // บังคับกรอก
  experienceYears: z.coerce.number().min(0, "ระบุปี"),
  baseSalary: z.coerce.number().min(1, "ระบุเงินเดือน"),
  multiplier: z.coerce.number().min(0.1, "ระบุตัวคูณ"), // บังคับตัวเลขที่ > 0
  personCount: z.coerce.number().min(1, "ระบุคน"),
  durationMonths: z.coerce.number().min(1, "ระบุเดือน"),
});

// 2. Schema สำหรับ บุคลากรสนับสนุน (ไม่เอาสาขาและตัวคูณ)
const personnelSuppSchema = z.object({
  position: z.string().min(1, "ระบุตำแหน่ง"),
  degree: z.string().min(1, "ระบุวุฒิ"),
  experienceYears: z.coerce.number().min(0, "ระบุปี"),
  baseSalary: z.coerce.number().min(1, "ระบุเงินเดือน"),
  personCount: z.coerce.number().min(1, "ระบุคน"),
  durationMonths: z.coerce.number().min(1, "ระบุเดือน"),
});

export const projectStep4Schema = z.object({
  hardwareCosts: z.array(hardwareCostSchema).default([]),
  softwareCosts: z.array(softwareCostSchema).default([]),
  // ใช้ Schema ที่แยกกันให้ตรงหมวด
  personnelCoreCosts: z.array(personnelCoreAndAsstSchema).default([]),
  personnelAsstCosts: z.array(personnelCoreAndAsstSchema).default([]),
  personnelSuppCosts: z.array(personnelSuppSchema).default([]),
});

// ---------------------------------------------------------------------------
// Step 5: ความพร้อม ผลสัมฤทธิ์ และเอกสารแนบ (Readiness & Attachments)
// ---------------------------------------------------------------------------
export const projectStep5Schema = z.object({
  operationDuration: z.coerce.number().min(1, "ระบุระยะเวลาดำเนินงาน (วัน)"),
  // ตารางบุคลากร ICT ที่มีอยู่ในปัจจุบัน
  currentIctStaff: z.array(
    z.object({
      position: z.string().min(1, "ระบุตำแหน่ง"),
      level: z.string().min(1, "ระบุระดับ"),
      count: z.coerce.number().min(1, "ระบุจำนวนคน"),
    })
  ).default([]),
  expectedBenefits: z.string().min(10, "ระบุประโยชน์ที่คาดว่าจะได้รับ"),
  submitterName: z.string().min(2, "ระบุชื่อผู้เสนอโครงการ"),
  submitterAgency: z.string().min(2, "ระบุหน่วยงาน"),
  submitterPhone: z.string().min(9, "ระบุเบอร์โทรศัพท์"),
  submitterEmail: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
});

// ---------------------------------------------------------------------------
// Master Schemas & Types
// ---------------------------------------------------------------------------
export const projectFormSchema = z.object({
  ...projectStep1Schema.shape,
  ...projectStep2Schema.shape,
  ...projectStep3Schema.shape,
  ...projectStep4Schema.shape,
  ...projectStep5Schema.shape,
});

export const projectDraftSchema = projectFormSchema.partial();

export type ProjectStep1Values = z.infer<typeof projectStep1Schema>;
export type ProjectStep2Values = z.infer<typeof projectStep2Schema>;
export type ProjectStep3Values = z.infer<typeof projectStep3Schema>;
export type ProjectStep4Values = z.infer<typeof projectStep4Schema>;
export type ProjectStep5Values = z.infer<typeof projectStep5Schema>;
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type ProjectDraftValues = z.infer<typeof projectDraftSchema>;