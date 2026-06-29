"use client";

import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "../../types";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const RoleModal = ({ isOpen, onClose, user }: RoleModalProps) => {
  // จำลอง State เพื่อเก็บสิทธิ์ที่ถูกเลือกหลายอัน
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // เมื่อเปิด Modal ให้ดึงค่า roles ดั้งเดิมมาใส่ใน State
  useEffect(() => {
    if (user) setSelectedRoles(user.roles);
  }, [user]);

  // ฟังก์ชันสลับเลือก/ยกเลิกสิทธิ์
  const handleRoleToggle = (role: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedRoles(prev => [...prev, role]);
    } else {
      setSelectedRoles(prev => prev.filter(r => r !== role));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>ปรับเปลี่ยนสิทธิ์ผู้ใช้งาน</DialogTitle>
          <DialogDescription>
            ผู้ใช้: <span className="font-bold text-slate-900">{user?.first_name} {user?.last_name}</span>
          </DialogDescription>
        </DialogHeader>
        
        {user && (
          <div className="space-y-4 py-2">
            {/* เปลี่ยนจาก Select มาเป็น Checkbox รองรับได้หลายบทบาท */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">กำหนดบทบาทและสิทธิ์ (Roles)</label>
              <div className="border border-border rounded-lg p-1 bg-slate-50/50">
                <div className="flex items-center space-x-3 p-3 hover:bg-slate-100 rounded-md transition-colors">
                  <Checkbox 
                    id="role-admin" 
                    checked={selectedRoles.includes("ADMIN")}
                    onCheckedChange={(c) => handleRoleToggle("ADMIN", c as boolean)}
                  />
                  <div className="flex flex-col">
                    <label htmlFor="role-admin" className="text-sm font-bold text-slate-800 cursor-pointer">Admin</label>
                    <span className="text-xs text-slate-500">ผู้ดูแลระบบ จัดการตารางข้อมูลอ้างอิงและตั้งค่าระบบได้ทั้งหมด</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 hover:bg-slate-100 rounded-md transition-colors border-t border-slate-100">
                  <Checkbox 
                    id="role-analyst" 
                    checked={selectedRoles.includes("ANALYST")}
                    onCheckedChange={(c) => handleRoleToggle("ANALYST", c as boolean)}
                  />
                  <div className="flex flex-col">
                    <label htmlFor="role-analyst" className="text-sm font-bold text-slate-800 cursor-pointer">Analyst</label>
                    <span className="text-xs text-slate-500">ผู้วิเคราะห์ รับมอบหมายให้ตรวจและบันทึกมติโครงการได้</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 hover:bg-slate-100 rounded-md transition-colors border-t border-slate-100">
                  <Checkbox 
                    id="role-user" 
                    checked={selectedRoles.includes("GENERAL_USER")}
                    onCheckedChange={(c) => handleRoleToggle("GENERAL_USER", c as boolean)}
                  />
                  <div className="flex flex-col">
                    <label htmlFor="role-user" className="text-sm font-bold text-slate-800 cursor-pointer">General User</label>
                    <span className="text-xs text-slate-500">ผู้ยื่นข้อเสนอ สามารถสร้าง แก้ไข และดูสถานะโครงการของตนได้</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
          <Button onClick={onClose} className="gap-2">
            <Check className="w-4 h-4" /> บันทึกสิทธิ์ใหม่
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};