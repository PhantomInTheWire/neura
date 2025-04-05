"use client";

import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CreateButton() {
  const BASE_URL = process.env.API_ENDPOINT ?? "http://localhost:8000";
  return (
    <Button
      variant="outline"
      className="mt-4 flex items-center gap-2"
      onClick={() => {
        fetch(`${BASE_URL}/api/workspaces`, { method: "POST" })
          .then((res) => res.json())
          .then((result) => {
            console.log(result);
            redirect(`./w/${result.id}`);
          });
      }}
    >
      <Plus className="h-4 w-4" />
      Create New
    </Button>
  );
}
