// src/app/(protected)/users/page.tsx
"use client";

import { useUsers } from "@/features/users/hooks/useUsers";
import { UserSummaryCards } from "@/features/users/components/UserSummaryCards";
import { UserToolbar } from "@/features/users/components/UserToolbar";
import { UserTable } from "@/features/users/components/UserTable";
import { UserPagination } from "@/features/users/components/UserPagination";

export default function UsersManagementPage() {
  const { 
    users, 
    searchQuery, handleSearchChange, 
    roleFilter, handleRoleChange,
    divisionFilter, handleDivisionChange,
    currentPage, setCurrentPage, totalPages,
    stats, uniqueDivisions
  } = useUsers();

  return (
    <div className="flex flex-col h-full p-6 lg:p-8 animate-in fade-in duration-500 mx-auto w-full max-w-7xl">
      
      {/* 1. Header (นำปุ่ม Create User ออกไปก่อนตามที่ตกลงกันครับ) */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#191c20] tracking-tight">ผู้ใช้งานระบบ</h1>
          <p className="text-sm text-[#3f4942] mt-1">จัดการรายชื่อ กำหนดสิทธิ์ และหน่วยงานของผู้ใช้ทั้งหมด</p>
        </div>
      </div>

      {/* 2. Summary Cards */}
      <UserSummaryCards stats={stats} />

      {/* 3. Main Content (Table + Tools) */}
      <div className="bg-white rounded-container border border-[#D1CDC7] shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* Toolbar: Search & Filters */}
        <UserToolbar 
          searchQuery={searchQuery} onSearchChange={handleSearchChange}
          roleFilter={roleFilter} onRoleChange={handleRoleChange}
          divisionFilter={divisionFilter} onDivisionChange={handleDivisionChange}
          uniqueDivisions={uniqueDivisions}
        />

        {/* Data Table */}
        <UserTable data={users} />

        {/* Pagination */}
        <UserPagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
        
      </div>
    </div>
  );
}