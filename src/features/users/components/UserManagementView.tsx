"use client";

import React from "react";
import { useUserManagement } from "../hooks/useUserManagement";
import { UserHeader } from "./UserHeader";
import { UserToolbar } from "./UserToolbar";
import { UserTable } from "./UserTable";
import { RoleModal } from "./modals/RoleModal";
import { PasswordModal } from "./modals/PasswordModal";

export const UserManagementView = () => {
  const {
    users,
    search, setSearch,
    deptFilter, setDeptFilter,
    roleFilter, setRoleFilter,
    activeOnly, setActiveOnly,
    selectedUser,
    isRoleModalOpen, setIsRoleModalOpen,
    isPasswordModalOpen, setIsPasswordModalOpen,
    tempPassword, setTempPassword,
    handleToggleActive,
    openRoleModal,
    openPasswordModal,
    sortField,
    sortDirection,
    handleSort
  } = useUserManagement();

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <UserHeader />
      
      <UserToolbar 
        search={search} setSearch={setSearch}
        deptFilter={deptFilter} setDeptFilter={setDeptFilter}
        roleFilter={roleFilter} setRoleFilter={setRoleFilter}
        activeOnly={activeOnly} setActiveOnly={setActiveOnly}
      />
      
      <UserTable 
        users={users}
        onToggleActive={handleToggleActive}
        onOpenRoleModal={openRoleModal}
        onOpenPasswordModal={openPasswordModal}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <RoleModal 
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)} 
        user={selectedUser} 
      />
      
      <PasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        user={selectedUser}
        tempPassword={tempPassword}
        setTempPassword={setTempPassword}
      />
    </div>
  );
};