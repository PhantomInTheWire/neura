"use client";

import { useRouter } from "next/navigation"; // Import useRouter
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

// Define the expected response structure for workspace creation
interface CreateWorkspaceResponse {
  _id: string;
  name: string;
  created_at: string;
  // Add other fields if the backend returns them
}


export default function CreateButton() {
  const router = useRouter(); // Get router instance
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Use the correct env variable
  const [open, setOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Add error state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error on new submission

    if (!BASE_URL) {
      setError("API URL is not configured.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/workspaces`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         // Send 'title' to match backend WorkspaceCreate model
         body: JSON.stringify({ title: workspaceName }),
       });

       if (!response.ok) {
        const errorData = await response.text(); // Get more error details if possible
        throw new Error(`Failed to create workspace: ${response.status} ${errorData}`);
      }

      const result: CreateWorkspaceResponse = await response.json();
      setOpen(false);
      setWorkspaceName(""); // Clear input on success
      // Use router.push for client-side navigation
      router.push(`/w/${result._id}`); // Use _id from the response
    } catch (error: any) {
      console.error("Error creating workspace:", error);
      setError(error.message || "An unknown error occurred."); // Set error state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
            <DialogDescription>
              Enter a name for your new workspace.
              {error && <p className="text-red-500 mt-2">{error}</p>} {/* Display error */}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Enter workspace name"
              className="w-full"
              autoFocus
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!workspaceName || isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
