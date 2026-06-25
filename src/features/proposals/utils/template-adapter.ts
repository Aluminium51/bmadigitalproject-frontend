// src/features/proposals/utils/template-adapter.ts
import { ProposalDraftValues } from "../types";
import { toCheckbox, withPlaceholder, hasItems } from "./docx-formatters";

// 🌟 กำหนดหน้าตาข้อมูล (Type) ให้ตรงกับคีย์แท็กดั้งเดิมในไฟล์ Word (.docx) ของคุณ
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
  hardwareCosts: any[]; // คีย์ตามที่ระบุในแบบเดิม
  softwareCosts: any[]; // คีย์ตามที่ระบุในแบบเดิม
}

/**
 * 🟢 ฟังก์ชันช่วยแปลงข้อมูล Array ตารางราคาให้ออกมาเป็นโครงสร้างของ Word ตามที่คุณกำหนด
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
    hasHardwareCosts: hasItems(rawData.hardwareCosts),
    hasSoftwareCosts: hasItems(rawData.softwareCosts),
    
    // แปลงก้อนตารางราคาโดยใช้ฟังก์ชัน mapCostItemsForWord ด้านบน
    hardwareCosts: mapCostItemsForWord(rawData.hardwareCosts || []),
    softwareCosts: mapCostItemsForWord(rawData.softwareCosts || []),
  };
};