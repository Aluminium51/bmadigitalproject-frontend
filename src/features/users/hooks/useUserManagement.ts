import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetUsers } from "./useGetUsers";
import type { User } from "../types";
import type { UserSortField, UserSortOrder } from "../api/users.api";

export type SortField = UserSortField;
export type SortDirection = UserSortOrder;

const PAGE_SIZE = 20;

export const useUserManagement = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [activeOnly, setActiveOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [activeOverrides, setActiveOverrides] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search]);

  const usersQuery = useGetUsers({
    page: currentPage,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    department: deptFilter === "ALL" ? undefined : deptFilter,
    role: roleFilter === "ALL" ? undefined : roleFilter,
    status: activeOnly ? "active" : "all",
    sort: sortField,
    order: sortDirection,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, deptFilter, roleFilter, activeOnly]);

  const users = useMemo(
    () => (usersQuery.data?.data ?? []).map((user) => ({
      ...user,
      is_active: activeOverrides[String(user.user_id)] ?? user.is_active,
    })),
    [activeOverrides, usersQuery.data?.data],
  );

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const handleToggleActive = useCallback((userId: string | number) => {
    const id = String(userId);
    const currentUser = users.find((user) => String(user.user_id) === id);
    setActiveOverrides((previous) => ({
      ...previous,
      [id]: !(previous[id] ?? currentUser?.is_active ?? false),
    }));
  }, [users]);

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
      setSortDirection((previous) => (previous === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField]);

  return {
    users,
    search,
    setSearch,
    deptFilter,
    setDeptFilter,
    roleFilter,
    setRoleFilter,
    activeOnly,
    setActiveOnly,
    currentPage,
    setCurrentPage,
    pagination: usersQuery.data?.pagination ?? {
      total: 0,
      page: currentPage,
      limit: PAGE_SIZE,
      totalPages: 0,
    },
    isLoading: usersQuery.isLoading,
    isFetching: usersQuery.isFetching,
    isError: usersQuery.isError,
    error: usersQuery.error,
    sortField,
    sortDirection,
    handleSort,
    selectedUser,
    isRoleModalOpen,
    setIsRoleModalOpen,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    tempPassword,
    setTempPassword,
    handleToggleActive,
    openRoleModal,
    openPasswordModal,
  };
};
