"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Remove hardcoded data import
// import { AI_RESPONSE } from "@/data/workspace";
// Link import is not used, can be removed if not needed elsewhere
// import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Define the expected structure for a section passed as a prop
// This should match the StudyGuideSection interface in Overview.tsx
interface Section {
  section_id: string; // Use section_id to match the data source
  section_title: string;
  // Add other fields if needed by the sidebar
}

// Define props for the component
interface SectionsSidebarProps {
  sections: Section[]; // Expect an array of sections
}

export default function SectionsSidebar({ sections = [] }: SectionsSidebarProps) { // Default to empty array
  const [activeSection, setActiveSection] = useState<string>("");

  // Map sections prop for easier use, using section_id
  const sectionData = sections.map(section => ({
    id: section.section_id, // Map section_id to id for internal use in this component
    title: section.section_title,
  }));


  useEffect(() => {
    // If no sections, don't set up observer
    if (sectionData.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Ensure ID exists before trying to replace
              if (entry.target.id) {
                setActiveSection(entry.target.id.replace("section-", ""));
              }
            }
          });
        },
        {
          rootMargin: "-20% 0px -80% 0px", // Adjust these values
          threshold: 0,
        }
      );

      sectionData.forEach((section) => {
        // Ensure section.id is valid before querying
        if (section.id) {
          const element = document.getElementById(`section-${section.id}`);
          if (element) observer.observe(element);
        }
      });

      return () => observer.disconnect();
  }, [sectionData]); // Depend on the derived sectionData

  const scrollToSection = (sectionId: string | undefined) => {
    // Check if sectionId is valid
    if (!sectionId) return;
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" }); // Adjust block alignment
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 p-4 sticky top-0 h-screen overflow-y-auto">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-base">Sections</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <nav className="flex flex-col gap-1">
            {sectionData.length > 0 ? (
              sectionData.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md text-left transition-colors truncate", // Added truncate
                    "hover:bg-muted hover:text-foreground",
                    activeSection === section.id
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                  title={section.title} // Add title attribute for full text on hover
                >
                  {section.title}
                </button>
              ))
            ) : (
              <p className="px-3 py-1.5 text-sm text-muted-foreground">No sections found.</p>
            )}
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
}
