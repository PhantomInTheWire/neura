"use client";

import { useState } from "react";
import { AI_RESPONSE, QUIZ_DATA } from "@/data/workspace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

export default function Overview() {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
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

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Web-Scale Graph</h1>

      <div className="space-y-8">
        {AI_RESPONSE.study_guide.map((section, index) => {
          const sectionId = `section-${index}`;
          const sectionQuiz = QUIZ_DATA.filter(
            (q) => q.sectionId === section.id
          );
          const currentQuizQuestion =
            sectionQuiz[currentQuizIndex[sectionId] || 0];

          return (
            <div key={sectionId} className="space-y-4 relative">
              <Card>
                <CardHeader className="sticky top-16 py-4 bg-card text-2xl">
                  <CardTitle>{section.section_title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarkdownRenderer content={section.explanation} />

                  {/* Display associated images if any */}
                  {section.associated_image_filenames.length > 0 && (
                    <div className="mt-4 flex gap-4 flex-wrap">
                      {section.associated_image_filenames.map(
                        (img, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={`/images/${img}`}
                            alt={`Figure ${imgIndex + 1}`}
                            className="rounded-lg border max-w-[200px]"
                          />
                        )
                      )}
                    </div>
                  )}

                  {/* Quiz Questions */}
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
                                    {(currentQuizIndex[sectionId] || 0) + 1} of{" "}
                                    {sectionQuiz.length}
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
                                            // Selected option highlighting
                                            // !showResults[
                                            //   currentQuizQuestion.id
                                            // ] &&
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
                                            showResults[currentQuizQuestion.id]
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
                                    selectedAnswers[currentQuizQuestion.id] ===
                                      undefined ||
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
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
