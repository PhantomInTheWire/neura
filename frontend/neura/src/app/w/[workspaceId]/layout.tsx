import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
