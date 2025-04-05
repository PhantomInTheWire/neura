"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Play } from "lucide-react";
import { Loader2 } from "lucide-react";

interface VideoPlayerProps {
  title: string;
  videoId: string;
}

export function VideoPlayer({ title, videoId }: VideoPlayerProps) {
  const BASE_URL = process.env.API_ENDPOINT ?? "http://localhost:8000";
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleOpenVideo = async () => {
    setIsOpen(true);
    setIsLoading(true);
    try {
      // Simulating video fetch - replace with actual API call
      const response = await fetch(`${BASE_URL}/api//${videoId}`);
      const data = await response.json();
      setVideoUrl(data.url);
    } catch (error) {
      console.error("Failed to load video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleOpenVideo}
        className="rounded-full hover:bg-muted"
      >
        <Play className="h-5 w-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[80vw]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted relative rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : videoUrl ? (
              <iframe
                src={videoUrl}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Failed to load video</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
