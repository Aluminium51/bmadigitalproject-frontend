import { Plus, Paperclip } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useProjectDocuments } from "../../hooks/useProjectDocuments";
import { DocListRow } from "./ui/DocListRow";
import { DiagramPreviewCard } from "./ui/DiagramPreviewCard";
import { DiagramUploadPlaceholder } from "./ui/DiagramUploadPlaceholder";
import { InfoTooltip } from "./ui/InfoTooltip";

export function DocumentsTabContent() {
  const {
    presentation,
    quotation,
    onePage,
    approvalDoc,
    systemDiagram,
    networkDiagram,
    useCaseDiagram,
    securityDiagram,
    additionalDocs,
    mandatoryUploadedCount,
    diagramsUploadedCount,
    setPresentation,
    setQuotation,
    setOnePage,
    setApprovalDoc,
    setSystemDiagram,
    setNetworkDiagram,
    setUseCaseDiagram,
    setSecurityDiagram,
    removeFile,
    removeAdditionalDoc,
    handleAddAdditionalDoc,
  } = useProjectDocuments();

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#191c20]">
              เอกสารประกอบโครงการ (บังคับ)
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              กรุณาอัปโหลดเอกสารสำคัญเหล่านี้ให้ครบถ้วนก่อนส่งโครงการ
            </p>
          </div>
          <Badge
            variant="outline"
            className="bg-white text-slate-600 border-slate-200 font-bold text-xs rounded-md px-3 py-1 shadow-sm shrink-0 self-start"
          >
            อัปโหลดแล้ว {mandatoryUploadedCount} / 4
          </Badge>
        </div>

        <Card className="rounded-md border-[#D1CDC7] shadow-sm bg-white overflow-hidden">
          <CardContent className="p-0 flex flex-col divide-y divide-slate-100">
            <DocListRow
              title="Presentation สรุปโครงการ"
              accept=".ppt,.pptx"
              file={presentation}
              onRemove={() => removeFile(setPresentation)}
              isRequired
            />
            <DocListRow
              title="ใบเสนอราคา (Quotation)"
              accept=".pdf"
              file={quotation}
              onRemove={() => removeFile(setQuotation)}
              isRequired
            />
            <DocListRow
              title="สรุปโครงการ (One Page Summary)"
              accept=".pdf"
              file={onePage}
              onRemove={() => removeFile(setOnePage)}
              isRequired
            />
            <DocListRow
              title="หนังสือรับรอง/เห็นชอบจากผู้บริหาร"
              accept=".pdf"
              file={approvalDoc}
              onRemove={() => removeFile(setApprovalDoc)}
              isRequired
            />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#191c20]">
              สถาปัตยกรรมและรูปภาพระบบ
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              แผนผังประกอบเพื่อความชัดเจนในการประเมินระบบ{" "}
              <span className="font-semibold text-slate-400">(ถ้ามี)</span>
            </p>
          </div>
          <Badge
            variant="outline"
            className="bg-white text-slate-600 border-slate-200 font-bold text-xs rounded-md px-3 py-1 shadow-sm shrink-0 self-start"
          >
            อัปโหลดแล้ว <span className="text-[#00734b]">{diagramsUploadedCount}</span> / 4
          </Badge>
        </div>

        <Card className="rounded-md border-[#D1CDC7] shadow-sm bg-white overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2.5 h-full">
                <div className="flex items-center justify-between ml-1">
                  <Label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="flex items-center justify-center bg-slate-100 w-5 h-5 rounded-md text-[11px] text-slate-500">
                      1
                    </span>
                    System Diagram
                  </Label>
                  <InfoTooltip
                    content={
                      <div className="space-y-1">
                        <p className="font-medium text-sm">แผนผังการเชื่อมโยงระบบ</p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          แสดงองค์ประกอบหลักของระบบ (เช่น Server, Database, Client)
                          และการไหลของข้อมูลเบื้องต้น
                        </p>
                      </div>
                    }
                  />
                </div>
                <div className="flex-1">
                  {systemDiagram ? (
                    <DiagramPreviewCard
                      file={systemDiagram}
                      onRemove={() => removeFile(setSystemDiagram)}
                    />
                  ) : (
                    <DiagramUploadPlaceholder title="อัปโหลด System Diagram" />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2.5 h-full">
                <div className="flex items-center justify-between ml-1">
                  <Label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="flex items-center justify-center bg-slate-100 w-5 h-5 rounded-md text-[11px] text-slate-500">
                      2
                    </span>
                    Network Diagram
                  </Label>
                  <InfoTooltip
                    content={
                      <div className="space-y-1">
                        <p className="font-medium text-sm">แผนผังการเชื่อมโยงเครือข่าย</p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          แสดงการจัดวางอุปกรณ์ Network (Router, Switch, Firewall) วง LAN/WAN
                          และการเชื่อมต่ออินเทอร์เน็ต
                        </p>
                      </div>
                    }
                  />
                </div>
                <div className="flex-1">
                  {networkDiagram ? (
                    <DiagramPreviewCard
                      file={networkDiagram}
                      onRemove={() => removeFile(setNetworkDiagram)}
                    />
                  ) : (
                    <DiagramUploadPlaceholder title="อัปโหลด Network Diagram" />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2.5 h-full">
                <div className="flex items-center justify-between ml-1">
                  <Label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="flex items-center justify-center bg-slate-100 w-5 h-5 rounded-md text-[11px] text-slate-500">
                      3
                    </span>
                    Use Case Diagram
                  </Label>
                  <InfoTooltip
                    content={
                      <div className="space-y-1">
                        <p className="font-medium text-sm">แผนภาพแสดงปฎิสัมพันธ์ระหว่างระบบงาน</p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          แสดงกลุ่มผู้ใช้งานระบบ (Actor) และสิทธิ์การเข้าถึงฟังก์ชันต่างๆ
                          ของระบบอย่างชัดเจน
                        </p>
                      </div>
                    }
                  />
                </div>
                <div className="flex-1">
                  {useCaseDiagram ? (
                    <DiagramPreviewCard
                      file={useCaseDiagram}
                      onRemove={() => removeFile(setUseCaseDiagram)}
                    />
                  ) : (
                    <DiagramUploadPlaceholder title="อัปโหลด Use Case Diagram" />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2.5 h-full">
                <div className="flex items-center justify-between ml-1">
                  <Label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="flex items-center justify-center bg-slate-100 w-5 h-5 rounded-md text-[11px] text-slate-500">
                      4
                    </span>
                    Security Diagram
                  </Label>
                  <InfoTooltip
                    content={
                      <div className="space-y-1">
                        <p className="font-medium text-sm">
                          การรักษาความมั่นคงปลอดภัยสารสนเทศ (Network, System, and Information
                          Security)
                        </p>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          แสดงจุดติดตั้งระบบรักษาความปลอดภัย เช่น WAF, ระบบ Authentication,
                          และการเข้ารหัสข้อมูล (Encryption)
                        </p>
                      </div>
                    }
                  />
                </div>
                <div className="flex-1">
                  {securityDiagram ? (
                    <DiagramPreviewCard
                      file={securityDiagram}
                      onRemove={() => removeFile(setSecurityDiagram)}
                    />
                  ) : (
                    <DiagramUploadPlaceholder title="อัปโหลด Security Diagram" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#191c20]">เอกสารอ้างอิงเพิ่มเติม</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              เอกสารอื่นๆ ที่เกี่ยวข้องกับโครงการ (TOR, รายละเอียดคุณลักษณะ ฯลฯ)
            </p>
          </div>
          <label className="flex items-center justify-center gap-2 px-5 py-2 bg-[#00734b]/10 text-[#00734b] border border-[#00734b]/20 rounded-md text-sm font-bold hover:bg-[#00734b] hover:text-white transition-all cursor-pointer shadow-sm whitespace-nowrap shrink-0 self-start">
            <Plus className="w-4 h-4" />
            เพิ่มเอกสาร
            <input type="file" multiple onChange={handleAddAdditionalDoc} className="hidden" />
          </label>
        </div>

        <Card className="rounded-md border-[#D1CDC7] shadow-sm bg-white overflow-hidden">
          <CardContent className="p-0">
            {additionalDocs.length > 0 ? (
              <div className="flex flex-col divide-y divide-slate-100">
                {additionalDocs.map((doc) => (
                  <DocListRow
                    key={doc.id}
                    title={doc.name.split(".")[0]}
                    file={doc}
                    onRemove={() => removeAdditionalDoc(doc.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 bg-slate-50 rounded-md flex items-center justify-center mb-4 border border-slate-200">
                  <Paperclip className="w-7 h-7 text-slate-300" />
                </div>
                <h3 className="text-base font-bold text-slate-700">ยังไม่มีเอกสารเพิ่มเติม</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm">
                  คุณสามารถอัปโหลดไฟล์เอกสารอ้างอิงอื่นๆ
                  ที่จะเป็นประโยชน์ต่อการพิจารณาโครงการได้ที่นี่
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
