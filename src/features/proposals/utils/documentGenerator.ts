// src/lib/documentGenerator.ts
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { ProposalDraftValues } from "@/features/proposals/types";

// @ts-expect-error - ImageModule ไม่มี Type definition ของ TypeScript อย่างเป็นทางการ
import ImageModule from "docxtemplater-image-module-free";

// แปลงไฟล์ (File) เป็น Base64 String
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};


// ดึงค่า Base64 ของรูปภาพโปร่งใสขนาด 1x1 px (ใช้สำหรับ Placeholder)
const getBlankImageBase64 = (): string => {
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
};


// ตรวจสอบว่าเป็นรูปภาพ Placeholder หรือไม่
const isBlankImage = (base64String: string): boolean => {
  return base64String === getBlankImageBase64();
};


// ฟังก์ชันหลักในการสร้างเอกสาร Word (.docx)
export const generateProposalDocx = async (formData: ProposalDraftValues) => {
  try {
    // 1. โหลดไฟล์ Template (.docx)
    const response = await fetch("/templates/project-proposal.docx");
    
    if (!response.ok) {
      throw new Error(`ดาวน์โหลด Template ไม่สำเร็จ (Status: ${response.status}) - กรุณาเช็คว่ามีไฟล์ public/templates/project-proposal.docx อยู่จริง`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const zip = new PizZip(arrayBuffer);
    const blankImageBase64 = getBlankImageBase64();

    // 2. จัดเตรียมและแปลงไฟล์รูปภาพเป็น Base64
    let systemImageBase64 = blankImageBase64;
    if (formData.systemDiagramFile?.file) {
      systemImageBase64 = await fileToBase64(formData.systemDiagramFile.file);
    }

    let networkImageBase64 = blankImageBase64;
    if (formData.networkDiagramFile?.file) {
      networkImageBase64 = await fileToBase64(formData.networkDiagramFile.file);
    }

    // 3. กำหนดค่าออปชันสำหรับ Image Module
    const imageOptions = {
      centered: true,
      getImage: function (tagValue: string): ArrayBuffer {
        // แปลง Base64 String กลับเป็น ArrayBuffer เพื่อส่งให้ docxtemplater
        const base64Data = tagValue.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      },
      getSize: function (img: ArrayBuffer, tagValue: string, tagName: string): [number, number] {
        // ถ้ารูปเป็น Placeholder ให้ย่อขนาดเหลือ 1x1 px (ซ่อนรูป)
        if (isBlankImage(tagValue)) {
          return [1, 1];
        }
        
        // กำหนดขนาดภาพตามชื่อ Tag ใน Template
        if (tagName === "systemImage") return [500, 350];
        if (tagName === "networkImage") return [500, 350];
        return [400, 300];
      },
    };
    
    const imageModule = new ImageModule(imageOptions);

    // 4. ตั้งค่าและสร้าง Docxtemplater Instance
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [imageModule],
      nullGetter: function () {
        return ""; // ถ้าเจอข้อมูลที่เป็น null/undefined ให้ใส่เป็นค่าว่างแทน
      },
    });

    // 5. จัดเตรียม Data Mapping สำหรับ Mapping เข้าเอกสาร
    const templateData = {
      ...formData,
      totalBudgetFormatted: formData.totalBudget 
        ? new Intl.NumberFormat('th-TH').format(formData.totalBudget)
        : "0.00",
      budgets: formData.budgetsByYear?.map(b => ({
        year: b.year,
        amount: new Intl.NumberFormat('th-TH').format(b.amount)
      })) || [],
      currentDate: new Date().toLocaleDateString('th-TH', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      }),
      
      systemImage: systemImageBase64,
      systemImageDesc: formData.systemDiagramFile?.description || "-",
      
      networkImage: networkImageBase64,
      networkImageDesc: formData.networkDiagramFile?.description || "-",
    };

    // 6. เรนเดอร์และดาวน์โหลดไฟล์
    doc.render(templateData);

    const output = doc.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const fileName = formData.projectName 
      ? `แบบเสนอโครงการ_${formData.projectName}.docx` 
      : "แบบเสนอโครงการ.docx";
      
    saveAs(output, fileName);

    return { success: true };
  } catch (error) {
    console.error("Error generating document:", error);
    return { success: false, error: String(error) };
  }
};