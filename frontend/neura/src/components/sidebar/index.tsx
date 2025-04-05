"use client";

import { useShallow } from "zustand/shallow";
import { useSidebarStore } from "@/store/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // Import Card components
import { cn } from "@/lib/utils";
import {
  Upload,
  Layout,
  MessagesSquare,
  Book,
  HelpCircle,
  // ChevronLeft,
  PanelLeftClose,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { name: "Uploads", icon: Upload, url: "uploads" },
  { name: "Overview", icon: Layout, url: "overview" },
  { name: "Chat", icon: MessagesSquare, url: "chat" },
  { name: "Quiz", icon: Book, url: "quiz" },
  { name: "FAQ", icon: HelpCircle, url: "faq" },
];

export default function Sidebar({ workspaceId }: { workspaceId: string }) {
  const [isOpen, toggleOpen] = useSidebarStore(
    useShallow((state) => [state.isOpen, state.toggleOpen])
  );
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "h-screen flex flex-col border-r bg-background transition-all duration-300 ease-in-out sticky top-0",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Header */}
      <Link href="/" className="flex items-center p-4 border-b">
        <h1
          className={cn(
            "font-bold text-2xl transition-all duration-300",
            isOpen ? "" : "mx-auto"
            // isOpen ? "opacity-100" : "opacity-0 w-0"
          )}
        >
          {isOpen ? "Neura" : "N"}
        </h1>
      </Link>

      {/* Navigation Links Card */}
      <div className="flex-1 p-4"> {/* Added padding around the card */}
        <Card className="p-0"> {/* Remove default card padding */}
          <CardContent className="p-2 flex flex-col gap-2"> {/* Add padding inside content, keep gap */}
            {LINKS.map((link) => {
              const isActive = pathname.includes(link.url);
              return (
            <Link href={`./${link.url}`} key={link.name}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start cursor-pointer",
                  !isOpen && "justify-center",
                  isActive ? "bg-muted" : "opacity-60"
                )}
              >
                <link.icon
                  className={cn("h-4 w-4", isActive && "text-primary")}
                />
                {isOpen && (
                  <span className={cn("ml-3", isActive && "font-medium")}>
                    {link.name}
                  </span>
                )}
              </Button>
            </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Toggle Button at Bottom */}
      <div className="p-4 border-t mt-auto mb-8"> {/* Keep toggle button separate for now */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleOpen}
          className="w-full justify-center cursor-pointer"
        >
          <PanelLeftClose
            className={cn("h-4 w-4 transition-all", !isOpen && "rotate-180")}
          />
          {isOpen && <span className="ml-2">Collapse</span>}
        </Button>
      </div>
    </div>
  );
}
