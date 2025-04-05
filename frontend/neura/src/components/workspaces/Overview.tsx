"use client";

import { useState, useEffect } from "react"; // Add useEffect
import { useParams } from "next/navigation"; // Import useParams
// Remove hardcoded data imports
// import { AI_RESPONSE, QUIZ_DATA } from "@/data/workspace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Loader2 } from "lucide-react"; // Add Loader2
import MarkdownRenderer from "./MarkdownRenderer";
import SectionsSidebar from "../sections-sidebar";
import { VideoPlayer } from "../ui/VideoPlayer";

// --- Define Interfaces for fetched data ---
// Based on backend/py_neuro/models.py

// Interface for extracted image info, including GridFS ID
interface ExtractedImageInfo {
  filename: string;
  page_number?: number | null;
  gridfs_id?: string | null; // Use string for frontend compatibility with ObjectId
}

// Interface for subsections (matching backend model)
interface StudyGuideSubsection {
  subsection_title: string;
  explanation: string;
  associated_image_filenames: string[];
}

// Interface for main sections (matching backend model)
interface StudyGuideSection {
  section_id: string; // Use section_id from model
  section_title: string;
  section_overview_description: string; // Add overview description
  subsection_titles: string[]; // Add subsection titles
  subsections: StudyGuideSubsection[]; // Add subsections
  // REMOVED: associated_image_filenames: string[]; // This field is not on the main section in the backend model
}

// Interface for the overall study guide structure (matching backend model)
// Renamed from StudyGuide to match backend model name
interface StudyGuideResponse {
  _id: string; // Assuming PyObjectId serializes to string
  original_filename: string;
  extracted_images: ExtractedImageInfo[]; // Add list of all extracted images
  study_guide: StudyGuideSection[];
  original_pdf_gridfs_id?: string | null;
  workspace_id: string; // Assuming PyObjectId serializes to string
}

// Interface for the workspace data fetched from the API
interface WorkspaceData {
  _id: string; // Assuming PyObjectId serializes to string
  title: string;
  created_at: string; // Assuming datetime serializes to string
  // REMOVED: files: any[]; // This field is not in the backend model WorkspaceWithPopulatedStudyGuides
  study_guides: StudyGuideResponse[]; // Updated to use renamed interface
}

// Define props to receive workspaceId directly
interface OverviewProps {
  workspaceId: string;
}

export default function Overview({ workspaceId }: OverviewProps) {
  // We'll still use useParams as a fallback
  const params = useParams();
  // Use provided workspaceId or extract from params as fallback
  const effectiveWorkspaceId = workspaceId || (typeof params.workspaceId === 'string' ? params.workspaceId : null);

  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Quiz state needs to be adapted for dynamic data
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [currentQuizIndex, setCurrentQuizIndex] = useState<
    Record<string, number>
  >({});

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleCheckAnswer = (questionId: string) => {
    setShowResults((prev) => ({
      ...prev,
      [questionId]: true,
    }));

    // Move to next question after a delay
    setTimeout(() => {
      setCurrentQuizIndex((prev) => ({
        ...prev,
        [questionId.split("-")[0]]: (prev[questionId.split("-")[0]] || 0) + 1,
      }));
    }, 1500);
  };

  const handleSkipQuestion = (sectionId: string) => {
    setCurrentQuizIndex((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] || 0) + 1,
    }));
  };

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      setIsLoading(true);
      setError(null);
      setWorkspace(null); // Clear previous data
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        setError("API URL is not configured.");
        setIsLoading(false);
        return;
      }
      if (!effectiveWorkspaceId) {
        setError("Workspace ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch the specific workspace details with cache control
        const response = await fetch(`${apiUrl}/api/workspaces/${effectiveWorkspaceId}`, {
          cache: 'no-store', // Prevent Next.js fetch caching for this request
        });
        if (!response.ok) {
           if (response.status === 404) {
             throw new Error("Workspace not found.");
           }
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        const data: WorkspaceData = await response.json();
        setWorkspace(data);
        // TODO: Fetch quiz data separately if it's not part of the workspace data
        // For now, we assume study_guides are included in the workspace fetch
      } catch (e: any) {
        console.error("Failed to fetch workspace data:", e);
        setError(`Failed to load workspace: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaceData();
  }, [effectiveWorkspaceId]); // Re-fetch if effectiveWorkspaceId changes


  // --- Render Logic ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2">Loading Workspace...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-red-500">
        <p>Error loading workspace:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p>Workspace data could not be loaded.</p>
      </div>
    );
  }

  // Assuming we display the first study guide found, or a message if none exist
  const studyGuide = workspace.study_guides?.[0];

  return (
    <div className="flex p-6 w-full mx-auto"> {/* Keep padding here */}
      <div className="flex-1">
        {/* Use fetched workspace title */}
        <h1 className="text-4xl font-bold mb-8">{workspace.title}</h1>

        {studyGuide ? (
          <div className="space-y-8">
            {studyGuide.study_guide.map((section, index) => {
              // Quiz data needs to be fetched/handled separately
              // const sectionId = `section-${index}`;
              // const sectionQuiz = QUIZ_DATA.filter(
              //   (q) => q.sectionId === section.id
              // );
              // const currentQuizQuestion =
              //   sectionQuiz[currentQuizIndex[sectionId] || 0];

              return (
                // Add id for potential sidebar navigation and scroll margin
                <div
                  key={section.section_id || `section-${index}`} // Use section_id
                  id={`section-${section.section_id}`} // Use section_id
                  className="space-y-4 relative scroll-mt-20"
                >
                  <Card>
                    <CardHeader className="sticky top-16 py-4 bg-card text-2xl">
                      <div className="flex items-center justify-between">
                        <CardTitle>{section.section_title}</CardTitle>
                        {/* Keep VideoPlayer, use section_id */}
                        <VideoPlayer
                          title={section.section_title}
                          videoId={section.section_id}
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
                        {/* Display the overview description */}
                        <p className="text-sm text-muted-foreground">
                          {section.section_overview_description || "(No overview description available)"}
                        </p>
                        {/* Display subsection titles if needed */}
                        {/*
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mt-2">
                          {section.subsection_titles?.map((title, i) => <li key={i}>{title}</li>)}
                        </ul>
                        */}
                      </CardContent>
                    </Card>

                    {/* Main Explanation - Removed as it's now in subsections */}
                    {/* <MarkdownRenderer content={section.explanation} /> */}

                      {/* REMOVED: Rendering logic for section.associated_image_filenames */}
                      {/* {section.associated_image_filenames?.length > 0 && ( ... )} */}

                      {/* Render Subsections */}
                      {section.subsections?.length > 0 && (
                         <div className="mt-6 space-y-4">
                           {section.subsections.map((subsection, subIndex) => (
                             <Card key={`${section.section_id}-sub-${subIndex}`} className="bg-background/50">
                               <CardHeader>
                                 <CardTitle className="text-lg">{subsection.subsection_title}</CardTitle>
                               </CardHeader>
                               <CardContent>
                                 <MarkdownRenderer content={subsection.explanation} />
                                 {/* Render subsection images if needed, similar logic as above */}
                                 {/* You would add image rendering logic for subsection.associated_image_filenames here if needed */}
                               </CardContent>
                             </Card>
                           ))}
                         </div>
                       )}


                      {/* --- Quiz Section Commented Out --- */}
                      {/*
                      {sectionQuiz.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-semibold mb-4">Quiz</h3>
                          <div className="relative h-[420px] overflow-hidden">
                            <AnimatePresence mode="popLayout">
                              {currentQuizQuestion && (
                                <motion.div
                                  key={currentQuizQuestion.id}
                                  initial={{ x: "100%", opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  exit={{ x: "-100%", opacity: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                  }}
                                  className="absolute top-0 left-0 w-full"
                                >
                                  <Card className="bg-muted p-4">
                                    <div className="flex justify-between items-center mb-4">
                                      <span className="text-sm text-muted-foreground">
                                        Question{" "}
                                        {(currentQuizIndex[sectionId] || 0) + 1}{" "}
                                        of {sectionQuiz.length}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleSkipQuestion(sectionId)
                                        }
                                      >
                                        Skip
                                      </Button>
                                    </div>

                                    <p className="font-medium mb-4">
                                      {currentQuizQuestion.question}
                                    </p>

                                    <div className="space-y-2">
                                      {currentQuizQuestion.options.map(
                                        (option, optionIndex) => (
                                          <motion.div
                                            key={optionIndex}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                          >
                                            <Button
                                              variant="outline"
                                              className={cn(
                                                "w-full justify-start relative",
                                                showResults[
                                                  currentQuizQuestion.id
                                                ] &&
                                                  optionIndex ===
                                                    currentQuizQuestion.correctAnswer &&
                                                  "border-green-500 bg-green-50",
                                                showResults[
                                                  currentQuizQuestion.id
                                                ] &&
                                                  selectedAnswers[
                                                    currentQuizQuestion.id
                                                  ] === optionIndex &&
                                                  optionIndex !==
                                                    currentQuizQuestion.correctAnswer &&
                                                  "border-red-500 bg-red-50",
                                                selectedAnswers[
                                                  currentQuizQuestion.id
                                                ] === optionIndex &&
                                                  "ring-2 ring-primary ring-offset-2 dark:ring-offset-background"
                                              )}
                                              onClick={() =>
                                                handleAnswerSelect(
                                                  currentQuizQuestion.id,
                                                  optionIndex
                                                )
                                              }
                                              disabled={
                                                showResults[
                                                  currentQuizQuestion.id
                                                ]
                                              }
                                            >
                                              {option}
                                              {showResults[
                                                currentQuizQuestion.id
                                              ] && (
                                                <motion.div
                                                  initial={{ scale: 0 }}
                                                  animate={{ scale: 1 }}
                                                  className="absolute right-2"
                                                >
                                                  {optionIndex ===
                                                  currentQuizQuestion.correctAnswer ? (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                  ) : (
                                                    selectedAnswers[
                                                      currentQuizQuestion.id
                                                    ] === optionIndex && (
                                                      <X className="h-4 w-4 text-red-500" />
                                                    )
                                                  )}
                                                </motion.div>
                                              )}
                                            </Button>
                                          </motion.div>
                                        )
                                      )}
                                    </div>

                                    <Button
                                      className="mt-4"
                                      onClick={() =>
                                        handleCheckAnswer(currentQuizQuestion.id)
                                      }
                                      disabled={
                                        selectedAnswers[
                                          currentQuizQuestion.id
                                        ] === undefined ||
                                        showResults[currentQuizQuestion.id]
                                      }
                                    >
                                      Check Answer
                                    </Button>
                                  </Card>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      )}
                      */}
                      {/* --- End Commented Out Quiz --- */}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No study guide available for this workspace yet. Upload a document to generate one.
          </p>
        )}
      </div>
      {/* Pass sections to sidebar if needed */}
      <SectionsSidebar sections={studyGuide?.study_guide || []} />
    </div>
  );
}
