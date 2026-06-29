// src/features/users/components/UserTable.tsx
import {
  MoreVertical,
  Shield,
  Key,
  UserX,
  UserCheck,
  ArrowDown,
  ArrowUpDown,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "../types";
import { SortField } from "../hooks/useUserManagement";

interface UserTableProps {
  users: User[];
  onToggleActive: (id: number) => void;
  onOpenRoleModal: (user: User) => void;
  onOpenPasswordModal: (user: User) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
}

export const UserTable = ({
  users,
  onToggleActive,
  onOpenRoleModal,
  onOpenPasswordModal,
  sortField,
  sortDirection,
  onSort,
}: UserTableProps) => {
  // ฟังก์ชันสร้าง Badge รองรับการเรียกซ้ำ
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge
            key={role}
            className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50 shadow-none"
          >
            Admin
          </Badge>
        );
      case "ANALYST":
        return (
          <Badge
            key={role}
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 shadow-none"
          >
            Analyst
          </Badge>
        );
      default:
        return (
          <Badge
            key={role}
            className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100 shadow-none"
          >
            General User
          </Badge>
        );
    }
  };

  // ฟังก์ชันสร้างไอคอนเรียงลำดับ
  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 w-4 h-4 text-slate-300" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 w-4 h-4 text-primary" /> 
      : <ArrowDown className="ml-2 w-4 h-4 text-primary" />;
  };

  return (
    <div className="border border-border rounded-md bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/70">
          <TableRow>
            <TableHead
              className="font-bold text-slate-700 py-3.5 pl-6 cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => onSort("first_name")}
            >
              <div className="flex items-center">
                ชื่อ-นามสกุล / ตำแหน่ง <SortIcon field="first_name" />
              </div>
            </TableHead>
            <TableHead className="font-bold text-slate-700">
              บัญชีผู้ใช้ (Username / Email)
            </TableHead>
            <TableHead
              className="font-bold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => onSort("department_name")}
            >
              <div className="flex items-center">
                สังกัดหน่วยงาน <SortIcon field="department_name" />
              </div>
            </TableHead>
            <TableHead className="font-bold text-slate-700">
              บทบาทสิทธิ์
            </TableHead>
            <TableHead className="font-bold text-slate-700 text-center">
              เข้าใช้งานล่าสุด
            </TableHead>
            <TableHead className="font-bold text-slate-700 text-center">
              สถานะ
            </TableHead>
            <TableHead className="font-bold text-slate-700 text-right pr-6">
              จัดการ
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100">
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-10 text-slate-400"
              >
                ไม่พบข้อมูลผู้ใช้งาน
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow
                key={user.user_id}
                className="hover:bg-slate-50/40 transition-colors"
              >
                {/* 1. ชื่อ-นามสกุล (เอา Avatar ออก) */}
                <TableCell className="py-4 pl-6">
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-slate-900 truncate">
                      {user.first_name} {user.last_name}
                    </span>
                    <span className="text-xs text-slate-500 truncate max-w-60">
                      {user.position || "-"}
                    </span>
                  </div>
                </TableCell>

                {/* 2. Username และ Email แยกกันชัดเจน */}
                <TableCell>
                  <div className="flex flex-col min-w-0">
                    <span className="text-slate-800 font-semibold text-sm truncate">
                      {user.username}
                    </span>
                    <span className="text-slate-500 text-xs truncate">
                      {user.email}
                    </span>
                  </div>
                </TableCell>

                {/* สังกัดสำนัก/ฝ่าย */}
                <TableCell>
                  <div className="flex flex-col text-xs max-w-60">
                    <span className="font-medium text-slate-800 truncate">
                      {user.department_name}
                    </span>
                    <span className="text-slate-500 truncate">
                      {user.division_name}
                    </span>
                  </div>
                </TableCell>

                {/* 3. บทบาทสิทธิ์ (เรียง Badge เป็น Array) */}
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {user.roles.map((role) => getRoleBadge(role))}
                  </div>
                </TableCell>

                <TableCell className="text-center text-xs text-slate-600 font-medium">
                  {user.last_login || "-"}
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Switch
                      checked={user.is_active}
                      onCheckedChange={() => onToggleActive(user.user_id)}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                    <span
                      className={`text-xs font-bold min-w-13.75 text-left ${user.is_active ? "text-emerald-600" : "text-rose-500"}`}
                    >
                      {user.is_active ? "Active" : "Suspended"}
                    </span>
                  </div>
                </TableCell>

                {/* เมนูจัดการ */}
                <TableCell className="text-right pr-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-45">
                      <DropdownMenuLabel>การจัดการบัญชี</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onOpenRoleModal(user)}
                      >
                        <Shield className="w-4 h-4 text-blue-500 mr-2" />{" "}
                        เปลี่ยนบทบาทสิทธิ์
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onOpenPasswordModal(user)}
                      >
                        <Key className="w-4 h-4 text-amber-500 mr-2" />{" "}
                        จัดการรหัสผ่าน
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-rose-600 font-medium cursor-pointer"
                        onClick={() => onToggleActive(user.user_id)}
                      >
                        {user.is_active ? (
                          <>
                            <UserX className="w-4 h-4 mr-2" /> ระงับการใช้งาน
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 text-emerald-600 mr-2" />{" "}
                            เปิดใช้งาน
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
