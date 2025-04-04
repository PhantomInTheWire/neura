"use client";

import { useShallow } from "zustand/shallow";
import { useSidebarStore } from "@/store/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Upload,
  Layout,
  MessagesSquare,
  Book,
  HelpCircle,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

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

  return (
    <div
      className={cn(
        "h-screen flex flex-col border-r bg-background transition-all duration-300 ease-in-out sticky top-0",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex items-center p-4 border-b">
        <h1
          className={cn(
            "font-bold text-xl transition-all duration-300",
            isOpen ? "opacity-100" : "opacity-0 w-0"
          )}
        >
          Neura
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleOpen}
          className={cn(
            "h-8 w-8 cursor-pointer z-10",
            isOpen ? "ml-auto" : "mx-auto"
          )}
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-all", !isOpen && "rotate-180")}
          />
        </Button>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {LINKS.map((link) => (
          <Link href={`./${link.url}`} key={link.name}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start cursor-pointer",
                !isOpen && "justify-center"
              )}
            >
              <link.icon className="h-4 w-4" />
              {isOpen && <span className="ml-3">{link.name}</span>}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
}

// {/* <TooltipProvider delayDuration={0}>
//           {LINKS.map((link) => (
//             <Tooltip key={link.name}>
//               {/* <TooltipTrigger asChild> */}
//                 <Button
//                   variant="ghost"
//                   className={cn(
//                     "w-full justify-start cursor-pointer",
//                     !isOpen && "justify-center"
//                   )}
//                   onClick={link.action}
//                 >
//                   <link.icon className="h-4 w-4" />
//                   {isOpen && <span className="ml-3">{link.name}</span>}
//                 </Button>
//               {/* </TooltipTrigger> */}
//               {!isOpen && (
//                 <TooltipContent side="right">{link.name}</TooltipContent>
//               )}
//             </Tooltip>
//           ))}
//         </TooltipProvider> */}
