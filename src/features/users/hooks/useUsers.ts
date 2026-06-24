// src/features/users/hooks/useUsers.ts
import { useState, useMemo } from "react";
import { mockUsers, uniqueDivisions } from "../data/mock-users";

export function useUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // จำนวนรายการต่อหน้า

  // useMemo : React ไม่ต้องคำนวณการกรองข้อมูลใหม่ทุกครั้งที่ Component render
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      // 1. กรองช่องค้นหา (หาจากชื่อ, นามสกุล, username หรือ email)
      const query = searchQuery.toLowerCase();
      const matchSearch = 
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      // 2. กรอง Role
      const matchRole = roleFilter === "all" || user.role === roleFilter;

      // 3. กรอง Division
      const matchDivision = divisionFilter === "all" || user.division === divisionFilter;

      return matchSearch && matchRole && matchDivision;
    });
  }, [searchQuery, roleFilter, divisionFilter]);

  // คำนวณข้อมูลสำหรับการทำ Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // คำนวณตัวเลขสถิติเพื่อไปแสดงบน Summary Cards
  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === "Active").length,
    admins: mockUsers.filter(u => u.role === "Admin").length,
  };

  // Reset หน้ากลับไปหน้า 1 เสมอเวลาพิมพ์ค้นหา หรือเปลี่ยน Filter
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleRoleChange = (val: string) => {
    setRoleFilter(val);
    setCurrentPage(1);
  };

  const handleDivisionChange = (val: string) => {
    setDivisionFilter(val);
    setCurrentPage(1);
  };

  return {
    users: paginatedUsers,
    searchQuery, handleSearchChange,
    roleFilter, handleRoleChange,
    divisionFilter, handleDivisionChange,
    currentPage, setCurrentPage, totalPages,
    stats,
    uniqueDivisions
  };
}