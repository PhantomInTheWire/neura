"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CreateButton() {
  return (
    <Button
      variant="outline"
      className="mt-4 flex items-center gap-2"
      onClick={() => {
        // Add your create notebook logic here
        console.log("Create new notebook");
      }}
    >
      <Plus className="h-4 w-4" />
      Create New
    </Button>
  );
}
