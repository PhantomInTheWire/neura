"use client";

import { redirect } from "next/navigation";
import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useFileStore } from "@/store/files";
import { FilePlus, X, FileIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatFileSize } from "@/lib/utils";
import { MultiStepLoader as Loader } from "@/components/ui/multistep-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";

const loadingStates = [
  {
    text: "Uploading Materials",
  },
  {
    text: "Analyzing the Content",
  },
  {
    text: "Understanding Material",
  },
  {
    text: "Segmenting Sections",
  },
  {
    text: "Summarizing Sections",
  },
  {
    text: "Creating Metadata",
  },
  {
    text: "Doing Something",
  },
];

export default function Uploads({ workspaceId }: { workspaceId: string }) {
  const BASE_URL = process.env.API_ENDPOINT ?? "http://localhost:8000";
  const [loading, setLoading] = useState(false);
  const { fileInputRef, handleFileChange, removeFile } = useFileUpload();
  const files = useFileStore(useShallow((state) => state.files));

  const handleGenerateOverview = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Attach all files from the store
      files.forEach((file) => {
        // Convert data URL back to File object
        const fileBlob = dataURLtoBlob(file.url);
        formData.append(
          "files",
          new File([fileBlob], file.name, { type: file.type })
        );
      });

      const response = await fetch(`${BASE_URL}/api/study-guides/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      redirect(`./w/${result.id}`);
    } catch (error) {
      console.error("Upload failed:", error);
      // Add error handling here (e.g., toast notification)
    } finally {
      setLoading(false);
    }
  };

  const dataURLtoBlob = (dataUrl: string): Blob => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  return (
    // Removed container div with p-6 to avoid double padding from layout
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Upload Files</h3>
            <p className="text-sm text-muted-foreground">
              Support for images, PDFs, videos, and more
            </p>
          </div>

          <Input
            type="file"
            multiple // Add multiple attribute
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.txt,.mp4,.mp3" // Optional: restrict file types
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted"
          >
            <div className="rounded-full bg-background p-3 shadow-sm">
              <FilePlus className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Click to select files</p>
              <p className="text-xs text-muted-foreground">
                You can select multiple files
              </p>
            </div>
          </div>

          <Loader
            loadingStates={loadingStates}
            loading={loading}
            duration={2000}
          />

          {files.length ? (
            <div className="w-full flex justify-center">
              <Button
                className="mx-auto cursor-pointer"
                onClick={handleGenerateOverview}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Overview"}
              </Button>
            </div>
          ) : (
            ""
          )}

          {loading && (
            <button
              className="fixed top-4 right-4 text-black dark:text-white z-[120]"
              onClick={() => setLoading(false)}
            >
              <IconSquareRoundedX className="h-10 w-10" />
            </button>
          )}
        </div>

        {/* Files List Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Uploaded Files</h3>
          <ScrollArea className="h-[400px] rounded-md border">
            <div className="p-4 space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center space-x-3">
                    <FileIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.id)}
                    className="h-8 w-8 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {files.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No files uploaded yet
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
