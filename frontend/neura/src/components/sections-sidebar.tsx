"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AI_RESPONSE } from "@/data/workspace"; // Assuming section data comes from here
import Link from "next/link";
import { cn } from "@/lib/utils";

// TODO: Implement active section highlighting based on scroll position or route

export default function SectionsSidebar() {
  // Extract sections for the sidebar (adjust data source if needed)
  const sections = AI_RESPONSE.study_guide.map((section) => ({
    id: section.id, // Assuming sections have unique IDs
    title: section.section_title,
  }));

  return (
    <aside className="hidden lg:flex flex-col w-64 border-l p-4 sticky top-0 h-screen overflow-y-auto">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-base">Sections</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <nav className="flex flex-col gap-1">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`#section-${section.id}`} // Basic hash link for now
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md hover:bg-muted text-muted-foreground"
                  // Add active state styling here later: 'bg-muted font-medium text-foreground'
                )}
              >
                {section.title}
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
}
