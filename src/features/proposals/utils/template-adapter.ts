// src/features/proposals/utils/template-adapter.ts
import { ProposalDraftValues } from "../types";
import { toCheckbox, withPlaceholder, hasItems } from "./docx-formatters";

// กำหนดหน้าตาข้อมูล (Type) ให้ตรงกับคีย์แท็กดั้งเดิมในไฟล์ Word (.docx) ของคุณ
export interface ProposalTemplateData extends Partial<ProposalDraftValues> {
  chkNew: string;
  chkReplace: string;
  chkPhase: string;
  hasManpower: boolean;
  hasEquipment: boolean;
  chkBma: string;
  chkAgency: string;
  chkGov: string;
  agencyStrategy?: string;
  agencyIssue?: string;
  agencyKpi?: string;
  governorPolicyCode?: string;
  governorPolicyName?: string;

  hasRelatedProjects: boolean;
  hasHardwareCosts: boolean;
  hasSoftwareCosts: boolean;
  hasPersonnelCoreCosts: boolean;
  hasPersonnelAsstCosts: boolean;
  hasPersonnelSuppCosts: boolean;
  hasPersonnelResponsibilities: boolean;
  hasTrainingCourses: boolean; 
  hasOtherCosts: boolean;

  hardwareCosts: any[]; 
  softwareCosts: any[];
  personnelCoreCosts: any[];
  personnelAsstCosts: any[];
  personnelSuppCosts: any[];
  personnelResponsibilities: any[];
  trainingCourses: any[];
  otherCosts: any[];
}

/**
 *  ฟังก์ชันช่วยแปลงข้อมูล Array ตารางราคาให้ออกมาเป็นโครงสร้างของ Word ตามที่คุณกำหนด
 */
const mapCostItemsForWord = (items: any[]) => {
  if (!items || items.length === 0) return [];
  return items.map((item, index) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;

    return {
      ...item,
      index: index + 1, // สามารถนำ {index} ไปใช้เป็นเลขลำดับในตารางได้
      
      // แปลงค่า Enum ให้เป็น Checkbox ☑ / ☐
      chkMdes: item.referenceType === "MDES" ? "☑" : "☐",
      chkMarket: item.referenceType === "MARKET" ? "☑" : "☐",
      chkPrev: item.referenceType === "PREVIOUS" ? "☑" : "☐",
      chkOther: item.referenceType === "OTHER" ? "☑" : "☐",
      
      // เติมจุดไข่ปลาป้องกันค่า undefined โผล่ใน Word กรณีฟิลด์นั้นไม่ได้ถูกกรอก
      mdesMonth: item.mdesMonth || "..........",
      mdesYear: item.mdesYear || "........",
      mdesItemNo: item.mdesItemNo || "........",
      marketCount: item.marketCount || "........",
      marketCompany: item.marketCompany || "................................",
      prevProject: item.prevProject || "................................",
      prevYear: item.prevYear || "........",
      otherDetail: item.otherDetail || "................................",
      
      // คำนวณราคารวมของแถวนั้นๆ ให้ Word นำไปแสดงผลได้ทันที
      rowTotal: (quantity * unitPrice).toLocaleString('th-TH'),
      unitPriceStr: unitPrice.toLocaleString('th-TH'),
    };
  });
};

const mapStandardCosts = (items: any[]) => {
  if (!items || items.length === 0) return [];
  return items.map((item, index) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    return {
      ...item,
      index: index + 1,
      chkMdes: item.referenceType === "MDES" ? "☑" : "☐",
      chkMarket: item.referenceType === "MARKET" ? "☑" : "☐",
      chkPrev: item.referenceType === "PREVIOUS" ? "☑" : "☐",
      chkOther: item.referenceType === "OTHER" ? "☑" : "☐",
      mdesMonth: item.mdesMonth || "..........",
      mdesYear: item.mdesYear || "........",
      mdesItemNo: item.mdesItemNo || "........",
      marketCount: item.marketCount || "........",
      marketCompany: item.marketCompany || "................................",
      prevProject: item.prevProject || "................................",
      prevYear: item.prevYear || "........",
      otherDetail: item.otherDetail || "................................",
      rowTotal: (quantity * unitPrice).toLocaleString('th-TH', { minimumFractionDigits: 2 }),
      unitPriceStr: unitPrice.toLocaleString('th-TH', { minimumFractionDigits: 2 }),
    };
  });
};

const mapPersonnelCoreAndAsst = (items: any[]) => {
  if (!items || items.length === 0) return [];
  return items.map((item, index) => {
    const baseSalary = Number(item.baseSalary) || 0;
    const multiplier = Number(item.multiplier) || 1;
    const calculatedSalary = baseSalary * multiplier;
    const personCount = Number(item.personCount) || 0;
    const durationMonths = Number(item.durationMonths) || 0;
    const total = baseSalary * multiplier * personCount * durationMonths;

    return {
      ...item,
      index: index + 1,
      baseSalaryStr: baseSalary.toLocaleString('th-TH'),
      multiplierStr: multiplier.toFixed(2),
      calculatedSalaryStr: calculatedSalary.toLocaleString('th-TH'),
      rowTotal: total.toLocaleString('th-TH', { minimumFractionDigits: 2 }),
    };
  });
};

const mapPersonnelSupport = (items: any[]) => {
  if (!items || items.length === 0) return [];
  return items.map((item, index) => {
    const baseSalary = Number(item.baseSalary) || 0;
    const personCount = Number(item.personCount) || 0;
    const durationMonths = Number(item.durationMonths) || 0;
    const total = baseSalary * personCount * durationMonths;

    return {
      ...item,
      index: index + 1,
      baseSalaryStr: baseSalary.toLocaleString('th-TH'),
      rowTotal: total.toLocaleString('th-TH', { minimumFractionDigits: 2 }),
    };
  });
};

const mapTrainingCourses = (items: any[]) => {
  if (!items || items.length === 0) return [];
  return items.map((item, index) => {
    // 4.1 คำนวณตารางวิทยากรย่อยในแต่ละคอร์ส (ชั่วโมง * อัตรา * วัน)
    let courseSpeakerTotal = 0;
    const formattedSpeakerCosts = (item.speakerCosts || []).map((sp: any, spIndex: number) => {
      const spTotal = (Number(sp.hours) || 0) * (Number(sp.ratePerHour) || 0) * (Number(sp.days) || 0);
      courseSpeakerTotal += spTotal;
      return {
        ...sp,
        index: spIndex + 1,
        ratePerHourStr: (Number(sp.ratePerHour) || 0).toLocaleString('th-TH'),
        rowTotal: spTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })
      };
    });

    // 4.2 คำนวณตารางค่าอาหารย่อยในแต่ละคอร์ส (มื้อ * อัตรา * คน * วัน)
    let courseFoodTotal = 0;
    const formattedFoodCosts = (item.foodCosts || []).map((fd: any, fdIndex: number) => {
      const fdTotal = (Number(fd.mealsCount) || 0) * (Number(fd.ratePerMeal) || 0) * (Number(fd.traineesCount) || 0) * (Number(fd.days) || 0);
      courseFoodTotal += fdTotal;
      return {
        ...fd,
        index: fdIndex + 1,
        ratePerMealStr: (Number(fd.ratePerMeal) || 0).toLocaleString('th-TH'),
        rowTotal: fdTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })
      };
    });

    const grandCourseTotal = courseSpeakerTotal + courseFoodTotal;

    return {
      ...item,
      index: index + 1,
      chkHasSpeaker: item.hasSpeakerCost ? "☑" : "☐",
      speakerReason: item.speakerReason || "................................",
      speakerCosts: formattedSpeakerCosts,
      foodCosts: formattedFoodCosts,
      // ราคารวมสรุปของคอร์สการอบรมนี้
      courseTotalStr: grandCourseTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })
    };
  });
};

const mapOtherCosts = (items: any[]) => {
  if (!items || items.length === 0) return [];
  return items.map((item, index) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    return {
      ...item,
      index: index + 1,
      chkIt: item.costType === "IT" ? "☑" : "☐",
      chkNonIt: item.costType === "NON_IT" ? "☑" : "☐",
      unitPriceStr: unitPrice.toLocaleString('th-TH'),
      rowTotal: (quantity * unitPrice).toLocaleString('th-TH', { minimumFractionDigits: 2 }),
      remark: item.remark || "-"
    };
  });
};

/**
 * Adapter หลักสำหรับจัดเตรียมข้อมูลเข้าสู่ Word Template
 */
export const prepareTemplateData = (
  rawData: ProposalDraftValues
): ProposalTemplateData => {
  const currentType = rawData.projectType || "";

  return {
    ...rawData, // โยนข้อมูลพื้นฐานไปก่อน

    // --- Step 2: Checkbox ประเภทโครงการ ---
    chkNew: currentType === "จัดหาใหม่" ? "☑" : "☐",
    chkReplace: currentType === "ทดแทนระบบเดิม" ? "☑" : "☐",
    chkPhase: currentType.includes("ต่อเนื่อง") ? "☑" : "☐",

    // --- Step 2 (ต่อ): เช็กข้อมูล Array สำหรับเปิด/ปิดตารางข้อมูลเดิม ---
    hasManpower: hasItems(rawData.manpower),
    hasEquipment: hasItems(rawData.existingEquipment),

    // --- Step 3: Checkbox ยุทธศาสตร์และความสอดคล้อง ---
    chkBma: rawData.isBmaPlan ? "☑" : "☐",
    chkAgency: rawData.isAgencyPlan ? "☑" : "☐",
    chkGov: rawData.isGovernorPolicy ? "☑" : "☐",

    // --- Step 3 (ต่อ): ป้องกันค่าว่างด้วยจุดไข่ปลาแบบเดิมของคุณ ---
    agencyStrategy: rawData.isAgencyPlan ? withPlaceholder(rawData.agencyStrategy, "..........................") : "..........................",
    agencyIssue: rawData.isAgencyPlan ? withPlaceholder(rawData.agencyIssue, "..........................") : "..........................",
    agencyKpi: rawData.isAgencyPlan ? withPlaceholder(rawData.agencyKpi, "..........................") : "..........................",
    governorPolicyCode: rawData.isGovernorPolicy ? withPlaceholder(rawData.governorPolicyCode, "..........................") : "..........................",
    governorPolicyName: rawData.isGovernorPolicy ? withPlaceholder(rawData.governorPolicyName, "..........................") : "..........................",

    hasRelatedProjects: hasItems(rawData.relatedProjects),

    // --- Step 4 : Boolean Flag เพื่อซ่อน/แสดงตารางราคา ---
// ตั้งค่า Boolean Flags คุมการแสดงตารางใน Word
    hasHardwareCosts: hasItems(rawData.hardwareCosts),
    hasSoftwareCosts: hasItems(rawData.softwareCosts),
    hasPersonnelCoreCosts: hasItems(rawData.personnelCoreCosts),
    hasPersonnelAsstCosts: hasItems(rawData.personnelAsstCosts),
    hasPersonnelSuppCosts: hasItems(rawData.personnelSuppCosts),
    hasPersonnelResponsibilities: hasItems(rawData.personnelResponsibilities),
    hasTrainingCourses: hasItems(rawData.trainingCourses),
    hasOtherCosts: hasItems(rawData.otherCosts),

    // รันกระบวนการจัดฟอร์แมตข้อมูลส่งออกไปยังคีย์ดั้งเดิมของเทมเพลต
    hardwareCosts: mapStandardCosts(rawData.hardwareCosts || []),
    softwareCosts: mapStandardCosts(rawData.softwareCosts || []),
    personnelCoreCosts: mapPersonnelCoreAndAsst(rawData.personnelCoreCosts || []),
    personnelAsstCosts: mapPersonnelCoreAndAsst(rawData.personnelAsstCosts || []),
    personnelSuppCosts: mapPersonnelSupport(rawData.personnelSuppCosts || []),
    
    personnelResponsibilities: (rawData.personnelResponsibilities || []).map((item, i) => ({
      ...item, index: i + 1
    })),
    
    trainingCourses: mapTrainingCourses(rawData.trainingCourses || []),
    otherCosts: mapOtherCosts(rawData.otherCosts || []),
  };
};