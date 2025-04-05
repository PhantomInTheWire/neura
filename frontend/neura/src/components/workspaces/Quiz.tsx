"use client";

import { useState } from "react";
import { QUIZ_DATA } from "@/data/workspace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Quiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    QUIZ_DATA.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Web-Scale Graph Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Test your knowledge about PinSage and Graph Convolutional Networks.
            {!showResults &&
              ` Answer all ${QUIZ_DATA.length} questions to complete the quiz.`}
          </p>
        </CardContent>
      </Card>

      {showResults ? (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-lg font-medium">
                Your Score: {calculateScore()} out of {QUIZ_DATA.length} (
                {Math.round((calculateScore() / QUIZ_DATA.length) * 100)}%)
              </p>
            </div>

            <div className="space-y-6">
              {QUIZ_DATA.map((question) => {
                const isCorrect =
                  answers[question.id] === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className={cn(
                      "p-4 rounded-lg",
                      isCorrect
                        ? "border-green-50 dark:border-green-900/20"
                        : "border-red-50 dark:border-red-900/20"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <Check className="h-5 w-5 text-green-600 mt-1 shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-red-600 mt-1 shrink-0" />
                      )}
                      <div>
                        <p className="font-medium">{question.question}</p>
                        <p className="text-sm mt-2">
                          Your answer: {question.options[answers[question.id]]}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Correct answer:{" "}
                            {question.options[question.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {QUIZ_DATA.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-lg">Question {index + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{question.question}</p>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <Button
                      key={optionIndex}
                      variant="outline"
                      className={`w-full justify-start ${
                        answers[question.id] === optionIndex
                          ? "!border-primary"
                          : ""
                      }`}
                      onClick={() =>
                        handleAnswerSelect(question.id, optionIndex)
                      }
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== QUIZ_DATA.length}
          >
            Submit Quiz
          </Button>
        </div>
      )}
    </div>
  );
}
