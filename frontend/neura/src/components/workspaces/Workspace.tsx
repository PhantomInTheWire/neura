"use client";

// import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Workspace({ workspaceId }: { workspaceId: string }) {
  useEffect(() => {
    redirect(`./${workspaceId}/uploads`);
  });
  return <div>Workspace</div>;
}
