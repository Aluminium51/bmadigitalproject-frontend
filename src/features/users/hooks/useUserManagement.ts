import { useState, useMemo, useCallback } from "react";
import { User } from "../types"

// ดึง MOCK_USERS มาจากไฟล์ data/mock-users.ts ของคุณ
import { MOCK_USERS } from "../data/mock-users"; 

export type SortField = 'first_name' | 'department_name' | 'last_login' | 'created_at';
export type SortDirection = 'asc' | 'desc';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  
  // Filters State
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [activeOnly, setActiveOnly] = useState(false);

  // Sorted State
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Modals State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  // Action: Toggle Active (ใช้ useCallback เพื่อไม่ให้ฟังก์ชันถูกสร้างใหม่ทุกครั้งที่ render)
  const handleToggleActive = useCallback((userId: number) => {
    setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, is_active: !u.is_active } : u));
  }, []);

  // Performance: Memoize filtered and sorted users
const filteredAndSortedUsers = useMemo(() => {
    // [1] Filter ข้อมูล (Logic เดิมของคุณ)
    let result = users.filter(user => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const matchSearch = fullName.includes(search.toLowerCase()) || 
                          user.username.toLowerCase().includes(search.toLowerCase()) ||
                          user.email.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === "ALL" || user.department_name === deptFilter;
      const matchRole = roleFilter === "ALL" || user.roles.includes(roleFilter);
      const matchActive = !activeOnly || user.is_active;

      return matchSearch && matchDept && matchRole && matchActive;
    });

    // [2] Sort ข้อมูลตามที่เลือก
    result = result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // จัดการกรณี Null หรือ undefined
      if (!valA) valA = "";
      if (!valB) valB = "";

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, search, deptFilter, roleFilter, activeOnly, sortField, sortDirection]);

  // Actions สำหรับเปิด Modal
  const openRoleModal = useCallback((user: User) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  }, []);

  const openPasswordModal = useCallback((user: User) => {
    setSelectedUser(user);
    setTempPassword(null);
    setIsPasswordModalOpen(true);
  }, []);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  return {
    // Data
    users: filteredAndSortedUsers,
    
    // Filter States & Setters
    search, setSearch,
    deptFilter, setDeptFilter,
    roleFilter, setRoleFilter,
    activeOnly, setActiveOnly,

    // Sort States & Actions
    sortField,
    sortDirection,
    handleSort,

    // Modal States
    selectedUser,
    isRoleModalOpen, setIsRoleModalOpen,
    isPasswordModalOpen, setIsPasswordModalOpen,
    tempPassword, setTempPassword,

    // Actions
    handleToggleActive,
    openRoleModal,
    openPasswordModal
  };
};