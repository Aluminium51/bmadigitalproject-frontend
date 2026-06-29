import { Search, Shield, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserToolbarProps {
  search: string;
  setSearch: (v: string) => void;
  deptFilter: string;
  setDeptFilter: (v: string) => void;
  roleFilter: string;
  setRoleFilter: (v: string) => void;
  activeOnly: boolean;
  setActiveOnly: (v: boolean) => void;
}

export const UserToolbar = ({ 
  search, setSearch, deptFilter, setDeptFilter, 
  roleFilter, setRoleFilter, activeOnly, setActiveOnly 
}: UserToolbarProps) => {
  return (
    <div className="bg-white p-4 rounded-md border border-border shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input placeholder="ค้นหาชื่อ, นามสกุล หรืออีเมลผู้ใช้..." className="pl-9 bg-slate-50/50" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-full sm:w-[220px] bg-slate-50/50">
            <Building2 className="w-4 h-4 text-slate-400 mr-2" />
            <SelectValue placeholder="กรองตามหน่วยงาน" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">ทุกหน่วยงาน</SelectItem>
            <SelectItem value="สำนักยุทธศาสตร์และประเมินผล">สำนักยุทธศาสตร์และประเมินผล</SelectItem>
            <SelectItem value="สำนักงานกลาง">สำนักงานกลาง</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[160px] bg-slate-50/50">
            <Shield className="w-4 h-4 text-slate-400 mr-2" />
            <SelectValue placeholder="กรองตามสิทธิ์" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">ทุกบทบาทสิทธิ์</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="ANALYST">Analyst</SelectItem>
            <SelectItem value="GENERAL_USER">User</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-dashed border-border shrink-0">
        <Switch id="active-filter" checked={activeOnly} onCheckedChange={setActiveOnly} />
        <Label htmlFor="active-filter" className="text-sm font-medium text-slate-600 cursor-pointer select-none">
          แสดงเฉพาะผู้ใช้งานที่ Active
        </Label>
      </div>
    </div>
  );
};