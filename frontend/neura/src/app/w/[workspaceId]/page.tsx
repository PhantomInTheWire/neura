import { redirect } from "next/navigation";

// This page component will now simply redirect to the default overview section
// for the given workspace ID.

type Props = {
  params: {
    workspaceId: string;
  };
};

// Destructure workspaceId directly from params in the function signature
export default function WorkspaceRedirectPage({ params: { workspaceId } }: Props) {
  // Redirect to the overview page for this workspace
  redirect(`/w/${workspaceId}/overview`);

  // This return is technically unreachable due to redirect,
  // but included for completeness or as a fallback.
  // return null; // Or a loading indicator if needed before redirect triggers
}
