// src/app/(protected)/meetings/[id]/agendas/page.tsx
"use client";

import { use, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AgendaDragDropList } from "@/features/meetings/components/AgendaDragDropList";
import { CreateAgendaDialog } from "@/features/meetings/components/CreateAgendaDialog";
import { MeetingWorkspaceHeader } from "@/features/meetings/components/MeetingWorkspaceHeader";
import { MeetingFilesPanel } from "@/features/meetings/components/MeetingFilesPanel";
import { useAgendas, useDeleteAgenda } from "@/features/meetings/hooks/useAgendas";
import { useMeeting } from "@/features/meetings/hooks/useMeetings";

export default function AgendasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const meetingQuery = useMeeting(id);
  const agendas = useAgendas(id);
  const deleteAgenda = useDeleteAgenda(id);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteAgendaId, setDeleteAgendaId] = useState<string | null>(null);

  const confirmDeleteAgenda = () => {
    if (!deleteAgendaId) return;

    const agendaId = deleteAgendaId;
    setDeleteAgendaId(null);
    deleteAgenda.mutate(agendaId, {
      onSuccess: () => toast.success("Agenda deleted successfully"),
      onError: (error) => toast.error("Unable to delete agenda", {
        description: error instanceof Error ? error.message : "Please try again.",
      }),
    });
  };

  if (meetingQuery.isLoading || agendas.isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-[#00734b]" />
        Loading meeting agendas...
      </div>
    );
  }

  if (meetingQuery.isError || !meetingQuery.data) {
    return <div className="mx-auto max-w-4xl rounded-md border border-red-200 bg-red-50 p-8 text-center text-red-700">Meeting not found.</div>;
  }

  if (agendas.isError) {
    return <div className="mx-auto max-w-4xl rounded-md border border-red-200 bg-red-50 p-8 text-center text-red-700">{agendas.error?.message ?? "Unable to load agendas."}</div>;
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-6 p-6 lg:p-8">
      <MeetingWorkspaceHeader meeting={meetingQuery.data} activeTab="agendas" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-[#191c20]">Manage meeting agendas</h2>
          <p className="mt-1 text-sm text-muted-foreground">Arrange agendas and link them to projects by agenda type.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-[#00734b] text-white hover:bg-[#005838] pl-4">
          <Plus className="mr-2 h-4 w-4" />
          {/*Add agenda*/}
          เพิ่มวาระการประชุม
        </Button>
      </div>

      <AgendaDragDropList
        groupedAgendas={agendas.groupedAgendas}
        availableProjects={agendas.availableProjects}
        onMoveUp={agendas.moveAgendaUp}
        onMoveDown={agendas.moveAgendaDown}
        onLinkProject={agendas.linkProject}
        onUnlinkProject={agendas.unlinkProject}
        onDelete={setDeleteAgendaId}
        isFirstInGroup={agendas.isFirstInGroup}
        isLastInGroup={agendas.isLastInGroup}
      />

      <CreateAgendaDialog
        meetingId={id}
        open={createOpen}
        onOpenChange={setCreateOpen}
        availableProjects={agendas.availableProjects}
      />

      <MeetingFilesPanel meetingId={id} />

      <AlertDialog open={Boolean(deleteAgendaId)} onOpenChange={(open) => !open && setDeleteAgendaId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this agenda?</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting the agenda also deletes its resolution and attachments. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteAgenda.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAgenda}
              disabled={deleteAgenda.isPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteAgenda.isPending ? "Deleting..." : "Delete agenda"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
