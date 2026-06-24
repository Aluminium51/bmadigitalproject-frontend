// src/features/users/data/mock-users.ts

export type UserRole = "Admin" | "User" | "Manager";
export type UserStatus = "Active" | "Inactive";

export interface UserItem {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  division: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
}

export const mockUsers: UserItem[] = [
  { id: "USR-001", username: "thanatorn.a", firstName: "ธนาธร", lastName: "เก่งงาน", email: "thanatorn@bma.go.th", position: "นักวิเคราะห์นโยบายและแผน", division: "สำนักยุทธศาสตร์และประเมินผล", role: "Admin", status: "Active", lastLogin: "10 นาทีที่แล้ว" },
  { id: "USR-002", username: "somchai.j", firstName: "สมชาย", lastName: "ใจดี", email: "somchai.j@bma.go.th", position: "นักวิชาการคอมพิวเตอร์", division: "สำนักยุทธศาสตร์และประเมินผล", role: "User", status: "Active", lastLogin: "1 ชม. ที่แล้ว" },
  { id: "USR-003", username: "wichai.m", firstName: "วิชัย", lastName: "มั่นคง", email: "wichai.m@bma.go.th", position: "ผู้อำนวยการกอง", division: "สำนักการคลัง", role: "Manager", status: "Active", lastLogin: "เมื่อวาน" },
  { id: "USR-004", username: "napa.c", firstName: "นภา", lastName: "เจริญดี", email: "napa.c@bma.go.th", position: "นักวิชาการคลัง", division: "สำนักการคลัง", role: "User", status: "Active", lastLogin: "2 วันที่แล้ว" },
  { id: "USR-005", username: "somsak.r", firstName: "สมศักดิ์", lastName: "รักเมือง", email: "somsak.r@bma.go.th", position: "วิศวกรโยธา", division: "สำนักการระบายน้ำ", role: "User", status: "Active", lastLogin: "สัปดาห์ที่แล้ว" },
  { id: "USR-006", username: "kanya.p", firstName: "กัญญา", lastName: "พูนสุข", email: "kanya.p@bma.go.th", position: "เจ้าพนักงานธุรการ", division: "สำนักการแพทย์", role: "User", status: "Active", lastLogin: "1 เดือนที่แล้ว" },
  { id: "USR-007", username: "anon.t", firstName: "อานนท์", lastName: "ทดสอบ", email: "anon.t@bma.go.th", position: "อดีตพนักงาน", division: "สำนักยุทธศาสตร์และประเมินผล", role: "User", status: "Inactive", lastLogin: "3 เดือนที่แล้ว" },
];

// ดึงรายชื่อหน่วยงานทั้งหมดออกมาทำ Dropdown แบบไม่ซ้ำกัน (Unique)
export const uniqueDivisions = Array.from(new Set(mockUsers.map(u => u.division)));