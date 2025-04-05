"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Removed AI_RESPONSE import
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Define the expected structure for a section passed as a prop
interface SectionInfo {
  section_id: string; // Use section_id from backend model
  section_title: string;
  // Add other fields if needed by the sidebar
}

interface SectionsSidebarProps {
  sections: SectionInfo[]; // Accept sections as a prop
}


export default function SectionsSidebar({ sections }: SectionsSidebarProps) { // Destructure sections from props
  const [activeSection, setActiveSection] = useState<string>("");

  // Removed hardcoded data mapping

  useEffect(() => {
    // Ensure sections prop is available and not empty before setting up observer
    if (!sections || sections.length === 0) {
       return; // Exit if no sections are provided
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Ensure entry.target.id exists and is a string before replacing
            const targetId = entry.target.id;
            if (typeof targetId === 'string') {
              setActiveSection(targetId.replace("section-", ""));
            }
          }
        });
      },
      {
        rootMargin: "-20% 0px -80% 0px", // Adjust these values to control when sections become active
        threshold: 0,
      }
    );

    sections.forEach((section) => {
      // Use section_id from the prop
      const element = document.getElementById(`section-${section.section_id}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]); // Depend on the sections prop

  const scrollToSection = (sectionId: string) => {
    // Use section_id
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle case where no sections are provided
  if (!sections || sections.length === 0) {
    return (
       <aside className="hidden lg:flex flex-col w-64 p-4 sticky top-0 h-screen overflow-y-auto">
         <Card className="flex-1">
           <CardHeader>
             <CardTitle className="text-base">Sections</CardTitle>
           </CardHeader>
           <CardContent className="p-2">
             <p className="text-sm text-muted-foreground">No sections available.</p>
           </CardContent>
         </Card>
       </aside>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 p-4 sticky top-0 h-screen overflow-y-auto">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-base">Sections</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <nav className="flex flex-col gap-1">
            {sections.map((section) => (
              <button
                key={section.section_id} // Use section_id
                onClick={() => scrollToSection(section.section_id)} // Use section_id
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md text-left transition-colors",
                  "hover:bg-muted hover:text-foreground",
                  activeSection === section.section_id // Use section_id
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {section.section_title} {/* Use section_title */}
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
}
