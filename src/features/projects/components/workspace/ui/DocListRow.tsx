import {
  CheckCircle,
  Paperclip,
  FileText,
  Presentation,
  FileImage,
  Trash2,
  UploadCloud,
} from "lucide-react";
import type { DocumentFile } from "../../../types/workspace";

interface DocListRowProps {
  title: string;
  accept?: string;
  file: DocumentFile | null;
  onRemove: () => void;
  isRequired?: boolean;
}

export function DocListRow({
  title,
  accept,
  file,
  onRemove,
  isRequired = false,
}: DocListRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-slate-50/80 transition-colors gap-4 group">
      <div className="flex gap-4 items-start">
        <div
          className={`mt-0.5 size-9 rounded-md flex items-center justify-center shrink-0 ${
            file
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-slate-50 text-slate-400 border border-slate-200"
          }`}
        >
          {file ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Paperclip className="w-4 h-4" />
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-[#191c20] flex items-center gap-2">
            {title}
            {isRequired && <span className="text-status-orange text-xs">*</span>}
          </p>
          {accept && (
            <p className="text-xs text-muted-foreground mt-0.5">
              รองรับไฟล์ {accept.replace(/\./g, " ").toUpperCase()}
            </p>
          )}
        </div>
      </div>

      <div className="sm:w-1/2 flex justify-end">
        {file ? (
          <div className="flex items-center justify-between pl-3 pr-2 py-2 bg-white rounded-md border border-slate-200 hover:border-red-200 transition-all shadow-sm w-full max-w-sm">
            <div className="flex items-center gap-3 overflow-hidden">
              <div
                className={`p-1.5 rounded-md shrink-0 ${
                  file.type === "pdf"
                    ? "text-red-500 bg-red-50"
                    : file.type === "ppt"
                      ? "text-orange-500 bg-orange-50"
                      : "text-blue-500 bg-blue-50"
                }`}
              >
                {file.type === "pdf" ? (
                  <FileText className="w-4 h-4" />
                ) : file.type === "ppt" ? (
                  <Presentation className="w-4 h-4" />
                ) : (
                  <FileImage className="w-4 h-4" />
                )}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold text-[#191c20] truncate">
                  {file.name}
                </span>
                {file.size && (
                  <span className="text-[10px] text-slate-400 leading-none">
                    {file.size}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onRemove}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all shrink-0"
              title="ลบไฟล์"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-[#D1CDC7] rounded-md text-sm font-bold text-[#3f4942] hover:bg-slate-50 hover:text-[#191c20] hover:border-[#00734b] transition-all cursor-pointer w-full sm:w-auto shadow-sm">
            <UploadCloud className="w-4 h-4" />
            อัปโหลดไฟล์
            <input type="file" accept={accept} className="hidden" />
          </label>
        )}
      </div>
    </div>
  );
}
