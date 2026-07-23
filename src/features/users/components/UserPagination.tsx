// src/features/users/components/UserPagination.tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function UserPagination({ currentPage, totalPages, onPageChange }: UserPaginationProps) {
  const pageCount = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), pageCount);

  return (
    <div className={cn("mt-auto shrink-0 border-t border-[#ededf4] bg-white p-4")}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(Math.max(1, safeCurrentPage - 1))}
              aria-disabled={safeCurrentPage === 1}
              className={safeCurrentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          <PaginationItem>
            <PaginationLink isActive aria-label={`Page ${safeCurrentPage} of ${pageCount}`}>
              {safeCurrentPage} <span className="ml-1 text-xs opacity-70">/ {pageCount}</span>
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(Math.min(pageCount, safeCurrentPage + 1))}
              aria-disabled={safeCurrentPage === pageCount}
              className={safeCurrentPage === pageCount ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
