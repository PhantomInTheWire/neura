"use client"; // Make this a client component

import Link from "next/link";
import { useState, useEffect } from "react";
import CreateButton from "./CreateButton";
import WorkspaceCard from "./WorkspaceCard";

// Define an interface for the workspace data fetched from the backend
// Match the backend model (models.py -> WorkspaceBase)
interface Workspace {
  _id: string; // MongoDB uses _id
  title: string; // Use 'title' to match backend model
  created_at: string; // Assuming ISO string format
  description?: string | null; // Add optional description if needed later
  // Add other fields if needed, e.g., files, study_guides
}

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoading(true);
      setError(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        setError("API URL is not configured.");
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/api/workspaces`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Workspace[] = await response.json();
        // Convert _id to string if it's not already (though FastAPI should handle this)
        // Also format date if needed
        setWorkspaces(data.map(ws => ({ ...ws, _id: String(ws._id) })));
      } catch (e: any) {
        console.error("Failed to fetch workspaces:", e);
        setError(`Failed to load workspaces: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Workspaces</h1>
        <CreateButton /> {/* Assuming CreateButton handles its own logic or we connect it later */}
      </div>

      {isLoading && <p>Loading workspaces...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.length === 0 ? (
            <p>No workspaces found. Create one to get started!</p>
          ) : (
            workspaces.map((workspace) => (
              <Link href={`/w/${workspace._id}`} key={workspace._id}>
                {/* Pass data compatible with WorkspaceCard props, using workspace.title */}
                <WorkspaceCard
                  id={workspace._id}
                  title={workspace.title}
                  dateCreated={new Date(workspace.created_at).toLocaleDateString()}
                  sources={[]}
                />
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
