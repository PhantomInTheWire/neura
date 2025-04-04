import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
// import { Separator } from "@/components/ui/separator";

type Props = {
  children: React.ReactNode;
  params: {
    workspaceId: string;
  };
};

export default async function layout({ children, params }: Props) {
  const { workspaceId } = await params;
  return (
    <div className="w-full flex">
      <Sidebar workspaceId={workspaceId} />
      {/* <Separator orientation="vertical" /> */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
