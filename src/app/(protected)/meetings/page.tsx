"use client";
// src/app/(protected)/meetings/page.tsx
// หน้ารายการการประชุมทั้งหมด — Meeting Sessions List

import { Plus } from "lucide-react";
import Link from "next/link";
import { MeetingListTable } from "@/features/meetings/components/MeetingListTable";
import { useMeetings } from "@/features/meetings/hooks/useMeetings";

export default function MeetingsPage() {
  const {
    filteredMeetings,
    searchQuery,
    filterStatus,
    setSearchQuery,
    setFilterStatus,
  } = useMeetings();

  return (
    <div className="flex flex-col h-full p-6 lg:p-8 animate-in fade-in duration-500 mx-auto w-full">

      {/* --- Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#191c20] tracking-tight">การประชุมทั้งหมด</h1>
          <p className="text-sm text-[#3f4942] mt-1">จัดการการประชุม วาระการประชุม และบันทึกมติคณะกรรมการ</p>
        </div>

        <Link
          href="/meetings/create"
          className="flex items-center gap-2 bg-[#00734b] hover:bg-primary-dark text-white px-6 py-3 rounded-full font-bold transition-all shadow-sm active:scale-95"
        >
          <Plus className="text-white w-5 h-5" />
          <span className="text-white">สร้างการประชุมใหม่</span>
        </Link>
      </div>

      {/* --- พื้นที่ตารางหลัก --- */}
      <MeetingListTable
        meetings={filteredMeetings}
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        onSearchChange={setSearchQuery}
        onFilterChange={setFilterStatus}
      />
    </div>
  );
}
