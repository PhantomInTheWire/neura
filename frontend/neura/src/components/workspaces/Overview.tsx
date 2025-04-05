"use client";

import { useState, useEffect } from "react"; // Import useEffect
// Remove hardcoded data imports
// import { AI_RESPONSE, QUIZ_DATA } from "@/data/workspace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Keep Button if needed for future quiz logic
// Keep necessary imports, remove unused ones
import { cn } from "@/lib/utils";
// import { motion, AnimatePresence } from "framer-motion"; // Remove framer-motion for now (quiz)
// import { Check, X } from "lucide-react"; // Remove quiz icons
import MarkdownRenderer from "./MarkdownRenderer";
import SectionsSidebar from "../sections-sidebar";
import { VideoPlayer } from "../ui/VideoPlayer";

// Define interfaces matching backend models
interface ExtractedImageInfo {
  filename: string;
  page_number?: number | null;
  gridfs_id?: string | null; // ObjectId as string
}

interface StudyGuideSubsection {
  subsection_title: string;
  explanation: string;
  associated_image_filenames: string[];
}

interface StudyGuideSection {
  section_id: string;
  section_title: string;
  section_overview_description: string;
  subsection_titles: string[];
  subsections: StudyGuideSubsection[];
}

interface StudyGuideResponse {
  id?: string | null; // ObjectId as string
  original_filename: string;
  extracted_images: ExtractedImageInfo[];
  study_guide: StudyGuideSection[];
  workspace_id: string; // ObjectId as string
  original_pdf_gridfs_id?: string | null; // ObjectId as string
}

// Add workspaceId prop
export default function Overview({ workspaceId }: { workspaceId: string }) {
  // State for fetched data, loading, and error
  const [studyGuideData, setStudyGuideData] =
    useState<StudyGuideResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  // Fetch data on component mount
  useEffect(() => {
    const fetchStudyGuide = async () => {
      if (!workspaceId) return; // Don't fetch if workspaceId is not available

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${BASE_URL}/api/workspaces/${workspaceId}/study-guides/` // Note the trailing slash
        );
        if (!response.ok) {
          if (response.status === 404) {
            setError("No study guide found for this workspace yet.");
            setStudyGuideData(null); // Ensure data is cleared
          } else {
             throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const data: StudyGuideResponse[] = await response.json();
          if (data && data.length > 0) {
            setStudyGuideData(data[0]); // Display the first study guide found
          } else {
             setError("No study guide found for this workspace yet.");
             setStudyGuideData(null); // Ensure data is cleared
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch study guide:", err);
        setError(err.message || "Failed to load study guide.");
        setStudyGuideData(null); // Ensure data is cleared on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudyGuide();
  }, [workspaceId, BASE_URL]); // Depend on workspaceId and BASE_URL

  // Helper function to get image URL from GridFS ID
  const getImageUrl = (filename: string): string | null => {
    const imageInfo = studyGuideData?.extracted_images.find(
      (img) => img.filename === filename
    );
    if (imageInfo?.gridfs_id) {
      return `${BASE_URL}/api/files/gridfs/${imageInfo.gridfs_id}`;
    }
    console.warn(`GridFS ID not found for image: ${filename}`);
    return null; // Or return a placeholder image URL
  };

  // --- Quiz state and handlers removed for now ---
  // const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  // const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  // const [currentQuizIndex, setCurrentQuizIndex] = useState<Record<string, number>>({});
  // ... quiz handler functions removed ...

  return (
    <div className="flex p-6 w-full mx-auto">
      <div className="flex-1">
        {/* Display loading state */}
        {isLoading && <p>Loading study guide...</p>}

        {/* Display error state */}
        {error && <p className="text-red-500">Error: {error}</p>}

<<<<<<< Updated upstream
            return (
              // Add id for potential sidebar navigation and scroll margin
              <div
                key={sectionId}
                id={`section-${section.id}`}
                className="space-y-4 relative scroll-mt-20"
              >
                <Card>
                  <CardHeader className="sticky top-16 py-4 bg-card text-2xl">
                    <div className="flex items-center justify-between">
                      <CardTitle>{section.section_title}</CardTitle>
                      <VideoPlayer
                        title={section.section_title}
                        videoId={section.id} // Assuming section.id can be used as videoId
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Added Section Overview Card */}
                    <Card className="mb-6 bg-muted/50 border-dashed">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Section Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {/* Placeholder for overview points - needs data source */}
                        <p className="text-sm text-muted-foreground">
                          (Overview points for &apos;{section.section_title}
                          &apos; will go here)
                        </p>
                        {/* Example structure if data existed:
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        {section.overviewPoints?.map((point, i) => <li key={i}>{point}</li>)}
                      </ul>
                      */}
                      </CardContent>
                    </Card>
=======
        {/* Display study guide content */}
        {!isLoading && !error && studyGuideData && (
          <>
            <h1 className="text-4xl font-bold mb-8">
              {studyGuideData.original_filename} Overview
            </h1>
            <div className="space-y-8">
              {studyGuideData.study_guide.map((section) => (
                <div
                  key={section.section_id}
                  id={`section-${section.section_id}`} // Use actual section_id
                  className="space-y-4 relative scroll-mt-20"
                >
                  <Card>
                    <CardHeader className="sticky top-16 py-4 bg-card text-2xl">
                      <CardTitle>{section.section_title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Section Overview Card */}
                      <Card className="mb-6 bg-muted/50 border-dashed">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Section Overview
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                           {/* Display actual overview description */}
                           <p className="text-sm text-muted-foreground">
                             {section.section_overview_description || "(No overview description provided)"}
                           </p>
                           {/* Optionally list subsection titles */}
                           {section.subsection_titles && section.subsection_titles.length > 0 && (
                             <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                               {section.subsection_titles.map((title, i) => <li key={i}>{title}</li>)}
                             </ul>
                           )}
                        </CardContent>
                      </Card>
>>>>>>> Stashed changes

                      {/* Render Subsections */}
                      {section.subsections.map((subsection, subIndex) => (
                        <div key={subIndex} className="mb-6">
                           <h3 className="text-xl font-semibold mb-2">{subsection.subsection_title}</h3>
                           {/* Add check for subsection.explanation being a string */}
                           {typeof subsection.explanation === 'string' ? (
                             <MarkdownRenderer content={subsection.explanation} />
                           ) : (
                             <p className="text-red-500 text-sm">[Error: Invalid explanation content]</p>
                           )}
                           {/* Display associated images for subsection */}
                           {subsection.associated_image_filenames.length > 0 && (
                             <div className="mt-4 flex gap-4 flex-wrap">
                               {subsection.associated_image_filenames.map(
                                 (imgFilename, imgIndex) => {
                                   const imageUrl = getImageUrl(imgFilename);
                                   return imageUrl ? (
                                     <img
                                       key={imgIndex}
                                       src={imageUrl}
                                       alt={`Figure for ${subsection.subsection_title} ${imgIndex + 1}`}
                                       className="rounded-lg border max-w-[200px]"
                                     />
                                   ) : null; // Don't render img tag if URL is null
                                 }
                               )}
                             </div>
                           )}
                        </div>
                      ))}

                      {/* --- Quiz section removed for now --- */}
                      {/*
                      {sectionQuiz.length > 0 && (
                        ... quiz rendering logic ...
                      )}
                      */}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </>
        )}
         {/* Display message if no study guide is loaded and not loading/error */}
         {!isLoading && !error && !studyGuideData && (
            <p>No study guide available for this workspace.</p>
         )}
      </div>
      {/* Pass sections to sidebar if data is available */}
      <SectionsSidebar sections={studyGuideData?.study_guide || []} />
    </div>
  );
}
