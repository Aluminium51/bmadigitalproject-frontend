// src/lib/documentGenerator.ts
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { ProjectDraftValues } from "@/features/projects/types";

// @ts-ignore
import ImageModule from "docxtemplater-image-module-free";

// 1. ฟังก์ชันช่วยเหลือ: แปลง File เป็น Base64 String แบบ Promise
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// 2. สร้างฟังก์ชันจำลองรูปภาพโปร่งใสเป็น Base64
const getBlankImageBase64 = () => {
  // Data URL ของรูปภาพโปร่งใสขนาด 1x1 พิกเซล
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
};

// 3. ฟังก์ชันตรวจสอบว่าเป็น Blank Image หรือไม่
const isBlankImage = (base64String: string) => {
  return base64String === getBlankImageBase64();
};


export const generateProjectDocx = async (formData: ProjectDraftValues) => {
  try {
    const response = await fetch("/templates/project-proposal.docx");
    const arrayBuffer = await response.arrayBuffer();

    const zip = new PizZip(arrayBuffer);

    const blankImageBase64 = getBlankImageBase64();

    // 🟢 แปลงรูปภาพเป็น Base64 แทนที่จะใช้ ArrayBuffer
    let systemImageBase64 = blankImageBase64;
    if (formData.systemDiagramFile?.file) {
      systemImageBase64 = await fileToBase64(formData.systemDiagramFile.file);
    }

    let networkImageBase64 = blankImageBase64;
    if (formData.networkDiagramFile?.file) {
      networkImageBase64 = await fileToBase64(formData.networkDiagramFile.file);
    }

    const imageOptions = {
      centered: true,
      getImage: function (tagValue: any) {
        // 🟢 อ่านค่า Base64 แล้วแปลงเป็น Buffer ให้ docxtemplater นำไปใช้งาน
        // tagValue ที่ได้มาคือ "data:image/png;base64,iVBORw0..."
        const base64Data = tagValue.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer; 
      },
      getSize: function (img: any, tagValue: any, tagName: string) {
        // 🟢 เช็คว่ารูปนี้คือรูปโปร่งใสที่เราสร้างขึ้นมาหลอกหรือไม่
        if (isBlankImage(tagValue)) {
          return [1, 1]; // ย่อให้เหลือ 1px
        }
        
        // ขนาดของภาพปกติ (กว้าง x สูง)
        if (tagName === "systemImage") return [500, 350];
        if (tagName === "networkImage") return [500, 350];
        return [400, 300]; 
      },
    };
    
    const imageModule = new ImageModule(imageOptions);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [imageModule],
      nullGetter: function (part) {
        if (!part.module) return ""; 
        if (part.module === "rawxml") return "";
        return "";
      },
    });

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
      
      // 🟢 ส่งค่าเป็น Base64 string เข้าไปแทน
      systemImage: systemImageBase64,
      systemImageDesc: formData.systemDiagramFile?.description || "-",
      
      networkImage: networkImageBase64,
      networkImageDesc: formData.networkDiagramFile?.description || "-",
    };

    // 🟢 ถ้ายังมี Error ตรงนี้ แสดงว่าโครงสร้าง Template มีปัญหา หรือ Module โหลดไม่สมบูรณ์
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