import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
// import SectionsSidebar from "@/components/sections-sidebar"; // Import the new sidebar
// import { Separator } from "@/components/ui/separator";

type Props = {
  children: React.ReactNode;
  // params: {
  //   workspaceId: string;
  // };
};

// Accept full params object
export default async function Layout({ children }: Props) {
  // Extract workspaceId inside the function body
  // const { workspaceId } = params;

  return (
    <div className="w-full flex h-screen overflow-hidden">
      {/* Pass the extracted workspaceId */}
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Navbar />
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
