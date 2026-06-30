import { UploadCloud } from "lucide-react";

interface DiagramUploadPlaceholderProps {
  title: string;
}

export function DiagramUploadPlaceholder({ title }: DiagramUploadPlaceholderProps) {
  return (
    <label className="border-2 border-dashed border-slate-300 rounded-md p-6 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-white hover:border-[#00734b]/50 hover:shadow-sm transition-all cursor-pointer group h-full min-h-[120px]">
      <div className="w-11 h-11 bg-white shadow-sm border border-slate-200 group-hover:bg-[#00734b]/10 group-hover:border-[#00734b]/20 rounded-md flex items-center justify-center mb-3 transition-colors">
        <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-[#00734b]" />
      </div>
      <span className="text-sm font-bold text-slate-600 group-hover:text-[#191c20] transition-colors line-clamp-2 px-2">
        {title}
      </span>
      <span className="text-[11px] font-medium text-slate-400 mt-1.5 bg-slate-100 px-2 py-0.5 rounded-md">
        PNG, JPG, WebP
      </span>
      <input type="file" accept=".png,.jpg,.jpeg,.webp" className="hidden" />
    </label>
  );
}
