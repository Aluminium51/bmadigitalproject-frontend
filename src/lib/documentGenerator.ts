// src/lib/documentGenerator.ts
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { ProjectDraftValues } from "@/features/projects/types";

export const generateProjectDocx = async (formData: ProjectDraftValues) => {
  try {
    // 1. โหลดไฟล์ Template จากโฟลเดอร์ public
    const response = await fetch("/templates/project-proposal.docx");
    const arrayBuffer = await response.arrayBuffer();

    // 2. โหลดไฟล์เข้า PizZip
    const zip = new PizZip(arrayBuffer);

    // 3. สร้าง instance ของ Docxtemplater
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // 💡 4. แปลงข้อมูลก่อนหยอด (สำคัญมาก: ควร Format ตัวเลข/วันที่ ให้สวยงามก่อน)
    const templateData = {
      ...formData,
      // ตัวอย่างการเพิ่ม field ที่ format แล้ว
      totalBudgetFormatted: formData.totalBudget 
        ? new Intl.NumberFormat('th-TH').format(formData.totalBudget)
        : "0.00",
      // ถ้ามี Array budgets ให้เตรียมข้อมูลด้วย
      budgets: formData.budgetsByYear?.map(b => ({
        year: b.year,
        amount: new Intl.NumberFormat('th-TH').format(b.amount)
      })) || [],
      // เติมวันที่พิมพ์
      currentDate: new Date().toLocaleDateString('th-TH', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      })
    };

    // 5. นำข้อมูลไปหยอดใน Template
    doc.render(templateData);

    // 6. สร้างไฟล์ผลลัพธ์ (Blob)
    const output = doc.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // 7. สั่งเด้งดาวน์โหลดไฟล์
    const fileName = formData.projectName 
      ? `แบบเสนอโครงการ_${formData.projectName}.docx` 
      : "แบบเสนอโครงการ.docx";
      
    saveAs(output, fileName);

    return { success: true };
  } catch (error) {
    console.error("Error generating document:", error);
    return { success: false, error };
  }
};