import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
// import SectionsSidebar from "@/components/sections-sidebar"; // Import the new sidebar
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
    <div className="w-full flex h-screen overflow-hidden">
      <Sidebar workspaceId={workspaceId} />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
