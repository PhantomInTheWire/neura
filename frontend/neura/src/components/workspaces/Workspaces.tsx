"use client"; // Add this for hooks

import Link from "next/link";
import { useState, useEffect } from "react"; // Import hooks
import CreateButton from "./CreateButton";
import WorkspaceCard from "./WorkspaceCard";

// Define the Workspace type based on backend model
interface Workspace {
  id: string; // MongoDB ObjectId as string
  title: string;
  description?: string | null;
  created_at: string; // ISO date string
}

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Remove trailing slash from the fetch URL
        const response = await fetch(`${BASE_URL}/api/workspaces`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Workspace[] = await response.json();
        // Ensure 'id' field exists (remap from '_id' if necessary, though alias should handle it)
        const formattedData = data.map(ws => ({ ...ws, id: ws.id || (ws as any)._id }));
        setWorkspaces(formattedData);
      } catch (err: any) {
        console.error("Failed to fetch workspaces:", err);
        setError(err.message || "Failed to load workspaces.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, [BASE_URL]); // Dependency array includes BASE_URL

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Notebooks</h1>
        <CreateButton />
      </div>

      {isLoading && <p>Loading workspaces...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.length === 0 ? (
            <p>No notebooks found. Create one!</p>
          ) : (
            workspaces.map((workspace) => (
              <Link href={`/w/${workspace.id}`} key={workspace.id}>
                {/* Pass props matching WorkspaceCard expectations, adapting from backend model */}
                <WorkspaceCard
                  id={workspace.id}
                  title={workspace.title}
                  dateCreated={workspace.created_at} // Use created_at
                  // sources prop is removed as it's not in the backend model
                />
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
