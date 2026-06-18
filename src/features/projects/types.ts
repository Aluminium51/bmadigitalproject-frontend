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
  totalBudget: z.coerce.number().min(1, "กรุณาเพิ่มรายการงบประมาณรายปีและระบุจำนวนเงิน"),
  // ตารางงบประมาณรายปี
  budgetsByYear: z.array(
    z.object({
      year: z.coerce
        .number({ message: "กรุณาระบุ พ.ศ. เป็นตัวเลข" })
        .int("ปี พ.ศ. ต้องเป็นจำนวนเต็ม")
        .min(2500, "กรุณาระบุปี พ.ศ. ให้ถูกต้อง (เช่น 2567)")
        .max(2600, "กรุณาระบุปี พ.ศ. ให้ถูกต้อง"),
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
const imageWithDescriptionSchema = z.object({
  id: z.string(),
  file: typeof window === "undefined" ? z.any() : z.instanceof(File).refine(
    (file) => file.type.startsWith("image/"),
    { message: "ต้องเป็นไฟล์รูปภาพเท่านั้น" }
  ),
  description: z.string().min(1, "กรุณาระบุคำอธิบายรูปภาพ (บังคับ)"),
});

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
  systemDiagramFile: imageWithDescriptionSchema.optional().nullable(),
  networkDiagramFile: imageWithDescriptionSchema.optional().nullable(),
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

// หน้าที่ความรับผิดชอบของบุคลากร (ใช้ร่วมกันทุกหมวด)
const personnelResponsibilitySchema = z.object({
  position: z.string(), // ไม่ต้องมี min(1) เพราะเราดึงมาอัตโนมัติ
  responsibility: z.string().min(1, "กรุณาระบุหน้าที่ความรับผิดชอบ"),
});

const speakerCostSchema = z.object({
  itemName: z.string().min(1, "ระบุรายการ"),
  hours: z.coerce.number().min(1, "ระบุจำนวนชั่วโมง"),
  ratePerHour: z.coerce.number().min(0, "ระบุอัตรา/ชั่วโมง"),
  days: z.coerce.number().min(1, "ระบุระยะเวลา(วัน)"),
});

const foodCostSchema = z.object({
  itemName: z.enum(["ค่าอาหาร (ไม่ครบมื้อ)", "ค่าอาหารและเครื่องดื่ม", "ค่าอาหารว่าง"]),
  mealsCount: z.coerce.number().min(0),
  ratePerMeal: z.coerce.number().min(0),
  traineesCount: z.coerce.number().min(0),
  days: z.coerce.number().min(0),
});

const trainingCourseSchema = z.object({
  courseName: z.string().min(1, "กรุณาระบุหลักสูตร"),
  trainingMethod: z.string().min(1, "กรุณาระบุวิธีการฝึกอบรม"),
  locationType: z.enum(["สถานที่ราชการ", "สถานที่เอกชน"]),
  
  // ตารางวิทยากร (แสดง/ซ่อน ผ่าน UI แต่ข้อมูลเก็บตรงนี้)
  hasSpeakerCost: z.boolean().default(false),
  speakerReason: z.string().optional(),
  speakerCosts: z.array(speakerCostSchema).default([]),

  // ตารางค่าอาหาร (Fixed 3 รายการเสมอ แต่สร้าง schema ไว้รองรับการเก็บค่า)
  foodCosts: z.array(foodCostSchema).default([
    { itemName: "ค่าอาหาร (ไม่ครบมื้อ)", mealsCount: 0, ratePerMeal: 0, traineesCount: 0, days: 0 },
    { itemName: "ค่าอาหารและเครื่องดื่ม", mealsCount: 0, ratePerMeal: 0, traineesCount: 0, days: 0 },
    { itemName: "ค่าอาหารว่าง", mealsCount: 0, ratePerMeal: 0, traineesCount: 0, days: 0 },
  ]),
}).superRefine((data, ctx) => {
  // ดักว่าถ้าติ๊ก "มีวิทยากร" ต้องกรอกเหตุผล
  if (data.hasSpeakerCost && (!data.speakerReason || data.speakerReason.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "กรุณาระบุเหตุผลความจำเป็น",
      path: ["speakerReason"],
    });
  }
});

const otherCostSchema = z.object({
  itemName: z.string().min(1, "ระบุรายการ"),
  quantity: z.coerce.number().min(1, "ระบุจำนวน"),
  unitPrice: z.coerce.number().min(0, "ห้ามติดลบ"),
  remark: z.string().optional(), // หมายเหตุเป็น Text ธรรมดา
});

export const projectStep4Schema = z.object({
  hardwareCosts: z.array(hardwareCostSchema).default([]),
  softwareCosts: z.array(softwareCostSchema).default([]),
  // ใช้ Schema ที่แยกกันให้ตรงหมวด
  personnelCoreCosts: z.array(personnelCoreAndAsstSchema).default([]),
  personnelAsstCosts: z.array(personnelCoreAndAsstSchema).default([]),
  personnelSuppCosts: z.array(personnelSuppSchema).default([]),
  personnelResponsibilities: z.array(personnelResponsibilitySchema).default([]),
  trainingCourses: z.array(trainingCourseSchema).default([]),
  otherCosts: z.array(otherCostSchema).default([]),
});

// ---------------------------------------------------------------------------
// Step 5: ความพร้อม
// ---------------------------------------------------------------------------
const ictPersonnelSchema = z.object({
  position: z.string().min(1, "ระบุตำแหน่ง"),
  level: z.string().min(1, "ระบุระดับ"),
  count: z.coerce.number().min(1, "ต้องมากกว่า 0"),
});

export const projectStep5Schema = z.object({
  durationDays: z.coerce
    .number()
    .min(1, "กรุณาระบุระยะเวลาดำเนินงาน"),
  ictPersonnel: z.array(ictPersonnelSchema).default([]),
  otherReadiness: z.string().optional(),
  expectedBenefits: z.string().min(1, "กรุณาระบุประโยชน์ที่คาดว่าจะได้รับ"),
  isInRoadmap: z.boolean({ 
    message: "กรุณาเลือกสถานะ Roadmap" 
  }),
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