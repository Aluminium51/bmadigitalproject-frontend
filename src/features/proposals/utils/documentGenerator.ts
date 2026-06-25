// src/lib/documentGenerator.ts
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { ProposalDraftValues } from "@/features/proposals/types";
import { prepareTemplateData } from "@/features/proposals/utils/template-adapter";

// @ts-expect-error - ImageModule ไม่มี Type definition ของ TypeScript อย่างเป็นทางการ
import ImageModule from "docxtemplater-image-module-free";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// ใช้ Base64 ของภาพขนาด 1x1 แบบเรียบง่ายที่สุด (สีขาวโปร่งใส) เพื่อป้องกัน Header ของ Base64 เสียหาย
const getBlankImageBase64 = (): string => {
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
};

export const generateProposalDocx = async (formData: ProposalDraftValues) => {
  try {
    const response = await fetch("/templates/project-proposal.docx");
    
    if (!response.ok) {
      throw new Error(`ดาวน์โหลด Template ไม่สำเร็จ (Status: ${response.status})`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const zip = new PizZip(arrayBuffer);
    const blankImageBase64 = getBlankImageBase64();

    // จัดการเตรียมภาพ
    let systemImageBase64 = blankImageBase64;
    if (formData.systemDiagramFile?.file) {
      systemImageBase64 = await fileToBase64(formData.systemDiagramFile.file);
    }

    let networkImageBase64 = blankImageBase64;
    if (formData.networkDiagramFile?.file) {
      networkImageBase64 = await fileToBase64(formData.networkDiagramFile.file);
    }

    let useCaseImageBase64 = blankImageBase64;
    if (formData.useCaseDiagramFile?.file) {
      useCaseImageBase64 = await fileToBase64(formData.useCaseDiagramFile.file);
    }

    let securityImageBase64 = blankImageBase64;
    if (formData.securityDiagramFile?.file) {
      securityImageBase64 = await fileToBase64(formData.securityDiagramFile.file);
    }

    const imageOptions = {
      centered: true,
      getImage: function (tagValue: string): ArrayBuffer {
        try {
          // ดักไว้เผื่อเป็นค่าว่าง
          if (!tagValue || typeof tagValue !== 'string') {
             tagValue = blankImageBase64;
          }
          
          const base64Data = tagValue.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
          const binaryString = window.atob(base64Data);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          return bytes.buffer;
        } catch (err) {
           console.error("Error converting image:", err);
           // ส่งกลับ buffer ว่างถ้ามีปัญหา (สำคัญมาก เพื่อไม่ให้แอป crash)
           return new ArrayBuffer(0); 
        }
      },
      getSize: function (img: ArrayBuffer, tagValue: string, tagName: string): [number, number] {
        // หาก buffer ว่าง หรือเป็นภาพโปร่งใส ให้ปรับลดเหลือ 1x1
        if (img.byteLength === 0 || tagValue === blankImageBase64) return [1, 1];
        
        // กำหนดขนาดให้ครอบคลุมชื่อ Tag ที่เพิ่มมาใหม่
        if (tagName === "systemImage") return [500, 350];
        if (tagName === "networkImage") return [500, 350];
        if (tagName === "useCaseImage") return [500, 350];
        if (tagName === "securityImage") return [500, 350];
        
        return [400, 300]; // ค่าดีฟอลต์
      },
    };
    
    const imageModule = new ImageModule(imageOptions);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [imageModule],
      nullGetter: function () {
        return ""; 
      },
    });

    const baseTemplateData = prepareTemplateData(formData);

    const finalTemplateData = {
      ...baseTemplateData,
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
      
      useCaseImage: useCaseImageBase64,
      useCaseImageDesc: formData.useCaseDiagramFile?.description || "-",

      securityImage: securityImageBase64,
      securityImageDesc: formData.securityDiagramFile?.description || "-",
    };

    doc.render(finalTemplateData);

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