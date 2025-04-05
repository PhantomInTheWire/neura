"use client";

import { useRouter } from "next/navigation"; // Import useRouter
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

// Define expected response structure (based on backend/py_neuro/models.py StudyGuideResponse)
interface UploadResponse {
  _id: string; // The ID of the created study guide document
  original_filename: string;
  // Include other fields if needed
}

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
  const router = useRouter(); // Get router instance
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Use correct env variable
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Add error state
  const { fileInputRef, handleFileChange, removeFile } = useFileUpload();
  const files = useFileStore(useShallow((state) => state.files));
  const clearFiles = useFileStore((state) => state.clearFiles); // Get clearFiles action

  // dataURLtoBlob function removed as it seems unused in the current logic

  // Update the handleGenerateOverview function
  const handleGenerateOverview = async () => {
    setLoading(true);
    setError(null); // Reset error

    if (!BASE_URL) {
      setError("API URL is not configured.");
      setLoading(false);
      return;
    }
    if (!workspaceId) {
      setError("Workspace ID is missing.");
      setLoading(false);
      return;
    }
    if (files.length === 0) {
      setError("Please select a file to upload.");
      setLoading(false);
      return;
    }

    // --- Modification: Upload only the first file ---
    // TODO: Implement multi-file upload handling (e.g., sequential uploads or backend change)
    const fileToUpload = files[0];
    if (!fileToUpload || !fileToUpload.file) {
       setError("Selected file is invalid.");
       setLoading(false);
       return;
    }
    console.log("Uploading file:", fileToUpload.name);
    // --- End Modification ---

    let studyGuideId: string | null = null; // To store the ID from response

    try {
      const formData = new FormData();
      // --- Modification: Append only the first file with key "file" ---
      formData.append("file", fileToUpload.file, fileToUpload.name);
      // --- End Modification ---

      // Only proceed if we have the file in formData
      if (formData.has("file")) {
        const response = await fetch(
          `${BASE_URL}/api/workspaces/${workspaceId}/study-guides`,
          {
            method: "POST",
            body: formData,
            // Note: Don't set Content-Type header manually for FormData,
            // the browser will set it correctly with the boundary.
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Upload failed: ${response.status} ${errorText}`);
        }

        const result: UploadResponse = await response.json();
        studyGuideId = result._id; // Use _id from response
        clearFiles(); // Clear files from store on successful upload

        // Add a longer delay before redirecting to allow DB update to settle
        setTimeout(() => {
          // Force a full page navigation to ensure fresh data load
          window.location.href = `/w/${workspaceId}/overview`;
        }, 2000); // Increased to 2000ms (2 seconds) to ensure backend has time to update the workspace

      } else {
        // This case should ideally not be reached due to checks above
        throw new Error("No valid file prepared for upload.");
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      setError(error.message || "An unknown error occurred during upload.");
      setLoading(false); // Stop loading on error
    } finally {
      // setLoading(false); // Loading is stopped on error or navigation triggers page change
      // No need to redirect here, router.push handles navigation on success
    }
  };
  //   try { // Removing duplicated loadingStates and commented out try block
  // };

  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Upload Document</h3>
             {/* Clarify that only one file is processed for now */}
            <p className="text-sm text-muted-foreground">
              Select a document (PDF, DOCX, PPTX, TXT) to generate a study guide. (Currently processes first selected file only)
            </p>
            {error && <p className="text-sm text-red-500">{error}</p>} {/* Display error */}
          </div>

          <Input
            type="file"
            // multiple // Keep multiple selection UI, but only first is used
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            // Update accepted types based on backend support
            accept=".pdf,.docx,.pptx,.txt"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted"
          >
            <div className="rounded-full bg-background p-3 shadow-sm">
              <FilePlus className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Click to select a file</p>
              <p className="text-xs text-muted-foreground">
                PDF, DOCX, PPTX, TXT supported
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
    </div>
  );
}
