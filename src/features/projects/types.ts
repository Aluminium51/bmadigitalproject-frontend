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
});

// ---------------------------------------------------------------------------
// Step 3: สถาปัตยกรรมองค์กร (Enterprise Architecture)
// ---------------------------------------------------------------------------
export const projectStep3Schema = z.object({
  strategicAlignments: z.array(z.string()).min(1, "เลือกความสอดคล้องเชิงยุทธศาสตร์อย่างน้อย 1 ข้อ"),
  obstacleLaws: z.string().optional(), // ให้เป็น Optional เผื่อไม่มีอุปสรรค
  appArchitecture: z.string().min(5, "อธิบายด้านระบบสารสนเทศ"),
  dataOwner: z.string().min(2, "ระบุหน่วยงานเจ้าของข้อมูล"),
  dataExchangePlan: z.string().min(5, "อธิบายแนวทางการแลกเปลี่ยนข้อมูล"),
  // สำหรับการแนบไฟล์ Diagram ให้ใช้ z.any() หรือ z.unknown() ไปก่อน แล้วค่อยดัก validation ฝั่ง UI
  systemDiagramFiles: z.any().optional(),
  networkDiagramFiles: z.any().optional(),
});

// ---------------------------------------------------------------------------
// Step 4: แผนงานและรายละเอียดงบประมาณ (Budget Breakdown)
// ---------------------------------------------------------------------------
export const projectStep4Schema = z.object({
  // หมวด 1: ครุภัณฑ์คอมพิวเตอร์
  hardwareCosts: z.array(
    z.object({
      itemName: z.string().min(1, "ระบุรายการ"),
      quantity: z.coerce.number().min(1, "ระบุจำนวน"),
      unitPrice: z.coerce.number().min(1, "ระบุราคาต่อหน่วย"),
      reference: z.string().optional(),
    })
  ).default([]),
  
  // หมวด 2: ซอฟต์แวร์
  softwareCosts: z.array(
    z.object({
      softwareName: z.string().min(1, "ระบุชื่อซอฟต์แวร์"),
      quantity: z.coerce.number().min(1, "ระบุจำนวน"),
      unitPrice: z.coerce.number().min(1, "ระบุราคาต่อหน่วย"),
      reference: z.string().optional(),
    })
  ).default([]),

  // หมวด 3: ค่าใช้จ่ายบุคลากร (บังคับต้องมีอย่างน้อย 1 คน)
  personnelCosts: z.array(
    z.object({
      roleLevel: z.enum(["บุคลากรหลัก", "บุคลากรผู้ช่วย", "บุคลากรสนับสนุน"]),
      position: z.string().min(1, "ระบุตำแหน่ง"),
      baseSalary: z.coerce.number().min(1, "ระบุเงินเดือน"),
      multiplier: z.coerce.number().min(0.1, "ระบุตัวคูณ"),
      personCount: z.coerce.number().min(1, "ระบุจำนวนคน"),
      durationMonths: z.coerce.number().min(1, "ระบุจำนวนเดือน"),
    })
  ).min(1, "กรุณาเพิ่มบุคลากรอย่างน้อย 1 รายการ"),

  // หมวด 4: ค่าใช้จ่ายอื่นๆ (รวมฝึกอบรม, สื่อประชาสัมพันธ์)
  otherCosts: z.array(
    z.object({
      itemName: z.string().min(1, "ระบุรายการ"),
      quantity: z.coerce.number().min(1, "ระบุจำนวน"),
      unitPrice: z.coerce.number().min(1, "ระบุราคาต่อหน่วย"),
      remark: z.string().optional(),
    })
  ).default([]),
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