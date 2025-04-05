import { Overview } from "@/components/workspaces";

// Define props to receive params from the dynamic route
type Props = {
  params: {
    workspaceId: string;
  };
};

// Accept params to pass workspaceId to the Overview component
export default function OverviewPage({ params }: Props) {
  const { workspaceId } = params;
  return <Overview workspaceId={workspaceId} />;
}
