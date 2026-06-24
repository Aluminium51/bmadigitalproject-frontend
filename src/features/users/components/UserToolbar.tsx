// src/features/users/components/UserToolbar.tsx
import { Search, Filter } from "lucide-react";

interface UserToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  roleFilter: string;
  onRoleChange: (val: string) => void;
  divisionFilter: string;
  onDivisionChange: (val: string) => void;
  uniqueDivisions: string[];
}

export function UserToolbar({
  searchQuery, onSearchChange,
  roleFilter, onRoleChange,
  divisionFilter, onDivisionChange,
  uniqueDivisions
}: UserToolbarProps) {
  return (
    <div className="p-6 border-b border-[#ededf4] flex flex-col sm:flex-row gap-4 bg-white shrink-0">
      
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="ค้นหาชื่อ, นามสกุล, Username..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 h-11 text-sm border border-[#D1CDC7] rounded-full bg-surface focus:outline-none focus:ring-2 focus:ring-[#00734b]/20 focus:border-[#00734b] transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select 
          value={divisionFilter}
          onChange={(e) => onDivisionChange(e.target.value)}
          className="h-11 px-4 text-sm font-semibold border border-[#D1CDC7] rounded-full bg-white text-[#3f4942] focus:outline-none focus:border-[#00734b] cursor-pointer"
        >
          <option value="all">ทุกหน่วยงาน</option>
          {uniqueDivisions.map(div => (
            <option key={div} value={div}>{div}</option>
          ))}
        </select>

        <select 
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value)}
          className="h-11 px-4 text-sm font-semibold border border-[#D1CDC7] rounded-full bg-white text-[#3f4942] focus:outline-none focus:border-[#00734b] cursor-pointer"
        >
          <option value="all">ทุกสิทธิ์การใช้งาน</option>
          <option value="Admin">แอดมิน (Admin)</option>
          <option value="Manager">ผู้บริหาร (Manager)</option>
          <option value="User">ผู้ใช้งาน (User)</option>
        </select>
      </div>

    </div>
  );
}