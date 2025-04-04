import { Workspace } from "@/components/workspaces";

type Props = {
  params: {
    workspaceId: string;
  };
};

export default async function page(props: Props) {
  const { workspaceId } = await props.params;
  return <Workspace workspaceId={workspaceId} />;
}
