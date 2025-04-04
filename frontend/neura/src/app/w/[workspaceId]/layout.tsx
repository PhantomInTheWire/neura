import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

type Props = {
  children: React.ReactNode;
  params: {
    workspaceId: string;
  };
};

export default async function layout({ children, params }: Props) {
  const { workspaceId } = await params;
  return (
    <div className="w-full h-screen flex">
      <Sidebar workspaceId={workspaceId} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
