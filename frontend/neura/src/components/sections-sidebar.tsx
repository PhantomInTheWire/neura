"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AI_RESPONSE } from "@/data/workspace";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function SectionsSidebar() {
  const [activeSection, setActiveSection] = useState<string>("");

  const sections = AI_RESPONSE.study_guide.map((section) => ({
    id: section.id,
    title: section.section_title,
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id.replace("section-", ""));
          }
        });
      },
      {
        rootMargin: "-20% 0px -80% 0px", // Adjust these values to control when sections become active
        threshold: 0,
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(`section-${section.id}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md text-left transition-colors",
                  "hover:bg-muted hover:text-foreground",
                  activeSection === section.id
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
}
