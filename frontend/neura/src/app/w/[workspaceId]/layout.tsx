import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import SectionsSidebar from "@/components/sections-sidebar"; // Import the new sidebar
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
    <div className="w-full flex h-screen overflow-hidden"> {/* Ensure full height and hide overflow */}
      <Sidebar workspaceId={workspaceId} />
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto"> {/* Allow vertical scrolling */}
        <Navbar />
        {/* Constrain width and center the content */}
        <div className="flex-1 p-6 w-full max-w-4xl mx-auto"> {/* Added max-width and mx-auto */}
          {children}
        </div>
      </main>
      {/* Right Sections Sidebar */}
      <SectionsSidebar /> {/* Add the new sidebar */}
    </div>
  );
}
