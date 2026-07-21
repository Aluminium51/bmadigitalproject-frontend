"use client";

import { useRef, useState } from "react";
import { Loader2, Paperclip, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type FileUploadModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  accept?: string;
  onUpload: (file: File, description: string) => Promise<void>;
};

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  const tokens = accept.split(",").map((token) => token.trim().toLowerCase()).filter(Boolean);
  const name = file.name.toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) return file.type.startsWith(token.slice(0, -1));
    return file.type.toLowerCase() === token;
  });
}

export function FileUploadModal({
  open,
  onOpenChange,
  title,
  accept,
  onUpload,
}: FileUploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setSelectedFile(null);
    setDescription("");
    setError(null);
    setIsDragging(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isUploading) return;
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  const selectFile = (file: File | undefined) => {
    if (!file) return;
    if (!matchesAccept(file, accept)) {
      setError(`Unsupported file type. Allowed: ${accept || "this file type"}.`);
      setSelectedFile(null);
      return;
    }
    setError(null);
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    const trimmedDescription = description.trim();
    if (!selectedFile || !trimmedDescription || isUploading) return;

    setError(null);
    setIsUploading(true);
    try {
      await onUpload(selectedFile, trimmedDescription);
      resetForm();
      onOpenChange(false);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "File upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const canUpload = Boolean(selectedFile && description.trim()) && !isUploading;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[min(94vw,560px)] max-w-none">
        <DialogHeader>
          <DialogTitle>Upload {title}</DialogTitle>
          <DialogDescription>
            Select a file and add its description before uploading.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              selectFile(event.dataTransfer.files[0]);
            }}
            className={cn(
              "rounded-lg border-2 border-dashed px-5 py-7 text-center transition-colors cursor-pointer",
              isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/60",
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(event) => selectFile(event.target.files?.[0])}
              disabled={isUploading}
            />
            <UploadCloud className="mx-auto mb-2 h-8 w-8 text-primary" />
            <p className="text-sm font-semibold">Drag and drop a file here</p>
            <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
            {accept && <p className="mt-2 text-[11px] text-muted-foreground">Allowed: {accept}</p>}
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between gap-3 rounded-md border bg-slate-50 px-3 py-2">
              <div className="flex min-w-0 items-center gap-2">
                <Paperclip className="h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(selectedFile.size)}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setSelectedFile(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                disabled={isUploading}
                aria-label="Remove selected file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="file-upload-description" className="text-sm font-semibold">
              Description
            </label>
            <Textarea
              id="file-upload-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="ถ้าไม่มีคำอธิบายให้กรอกว่า ไม่มี"
              rows={3}
              disabled={isUploading}
              aria-invalid={Boolean(error)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button type="button" onClick={() => void handleUpload()} disabled={!canUpload}>
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
