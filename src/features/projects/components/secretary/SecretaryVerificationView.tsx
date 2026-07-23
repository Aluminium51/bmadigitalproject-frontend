"use client";

import { useMemo, useState } from "react";
import { AlertCircle, ClipboardCheck, Eye, RefreshCw, Search } from "lucide-react";
import { z } from "zod";
import { schemas } from "@/types/api-schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SecretaryReviewDialog } from "./SecretaryReviewDialog";
import { useSecretaryPendingProjects } from "../../hooks/useSecretaryVerification";

type Project = z.infer<typeof schemas.Project>;

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

export function SecretaryVerificationView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const projectsQuery = useSecretaryPendingProjects({ page, search });
  const projects = projectsQuery.data?.data ?? [];
  const pagination = projectsQuery.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const pendingCountLabel = useMemo(() => {
    if (projectsQuery.isLoading) return "กำลังโหลด";
    return `${pagination?.total ?? 0} โครงการ`;
  }, [pagination?.total, projectsQuery.isLoading]);

  const openReview = (project: Project) => {
    setSelectedProject(project);
    setIsReviewOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <main className="mx-auto flex w-full max-w-full flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <ClipboardCheck className="size-4" />
            งานเลขานุการ
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ตรวจสอบและรับหนังสือขอโครงการ
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ตรวจสอบโครงการที่ผู้ใช้งานส่งเข้าระบบจากทุกหน่วยงาน
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 self-start sm:self-auto"
          onClick={() => projectsQuery.refetch()}
          disabled={projectsQuery.isFetching}
        >
          <RefreshCw className={projectsQuery.isFetching ? "size-4 animate-spin" : "size-4"} />
          รีเฟรช
        </Button>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">รอตรวจสอบ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-600">{pendingCountLabel}</p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">สถานะการทำงาน</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              โครงการจะหายออกจากรายการนี้ทันทีหลังบันทึกผลการตรวจสอบสำเร็จ
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 border-b bg-card sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">โครงการรอเลขานุการตรวจสอบ</CardTitle>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="ค้นหารหัส ชื่อ หรือผู้เสนอ..."
              className="pl-9"
            />
          </div>
        </CardHeader>

        {projectsQuery.isError ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <AlertCircle className="size-8 text-destructive" />
            <p className="font-medium">ไม่สามารถโหลดรายการโครงการได้</p>
            <p className="text-sm text-muted-foreground">
              {projectsQuery.error instanceof Error ? projectsQuery.error.message : "กรุณาลองใหม่อีกครั้ง"}
            </p>
            <Button variant="outline" onClick={() => projectsQuery.refetch()}>ลองใหม่</Button>
          </div>
        ) : projectsQuery.isLoading ? (
          <TableSkeleton />
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-12 text-center">
            <ClipboardCheck className="size-10 text-muted-foreground/50" />
            <p className="font-medium">ไม่มีโครงการที่รอตรวจสอบ</p>
            <p className="text-sm text-muted-foreground">เมื่อมีผู้ส่งโครงการ รายการจะแสดงที่นี่</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">โครงการ</TableHead>
                  <TableHead>ผู้เสนอ / หน่วยงาน</TableHead>
                  <TableHead>วันที่ส่ง</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="pr-5 text-right">ดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="max-w-[320px] pl-5">
                      <div className="space-y-1">
                        <p className="font-mono text-xs text-muted-foreground">
                          {project.projectCode ?? "ไม่มีรหัสโครงการ"}
                        </p>
                        <p className="truncate font-semibold" title={project.projectName ?? undefined}>
                          {project.projectName ?? "ไม่ระบุชื่อโครงการ"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium">
                          {project.owner
                            ? `${project.owner.firstName} ${project.owner.lastName}`.trim()
                            : "-"}
                        </p>
                        <p className="max-w-[220px] truncate text-xs text-muted-foreground">
                          {project.division?.departmentName ?? "ไม่ระบุหน่วยงาน"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(project.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                        รอตรวจสอบ
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => openReview(project)}>
                        <Eye className="size-4" />
                        ตรวจสอบ
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-col items-center justify-between gap-3 border-t px-5 py-4 text-sm sm:flex-row">
              <p className="text-muted-foreground">
                หน้า {pagination?.page ?? page} จาก {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || projectsQuery.isFetching}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  ก่อนหน้า
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || projectsQuery.isFetching}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  ถัดไป
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      <SecretaryReviewDialog
        project={selectedProject}
        open={isReviewOpen}
        onOpenChange={(open) => {
          setIsReviewOpen(open);
          if (!open) setSelectedProject(null);
        }}
      />
    </main>
  );
}
