import { Workspace } from "@/components/workspaces";

type Props = {
  params: {
    workspaceId: string;
  };
};

export default function page(props: Props) {
  return <Workspace workspaceId={props.params.workspaceId} />;
}
