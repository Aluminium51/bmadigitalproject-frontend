import { FileImage, Trash2 } from "lucide-react";
import type { DocumentFile } from "../../../types/workspace";

interface DiagramPreviewCardProps {
  file: DocumentFile;
  onRemove: () => void;
}

export function DiagramPreviewCard({ file, onRemove }: DiagramPreviewCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-md border border-blue-200 group hover:border-blue-300 hover:shadow-sm transition-all h-full min-h-[120px]">
      <div className="flex items-center gap-4 overflow-hidden min-w-0">
        <div className="p-3 rounded-md shrink-0 text-blue-600 bg-blue-100/50 border border-blue-200">
          <FileImage className="w-6 h-6" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-[#191c20] truncate block w-full">
            {file.name}
          </span>
          {file.size && (
            <span className="text-[11px] font-medium text-slate-500 mt-0.5">
              {file.size}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={onRemove}
        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all shrink-0 ml-2"
        title="ลบไฟล์รูปภาพ"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
