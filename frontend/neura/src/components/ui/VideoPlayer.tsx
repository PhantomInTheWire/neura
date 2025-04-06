"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Play } from "lucide-react";
import { Loader2 } from "lucide-react";

interface VideoPlayerProps {
  title: string;
  videoId: string;
  description?: string;
}

export function VideoPlayer({ title, videoId, description }: VideoPlayerProps) {
  const BASE_URL = "http://localhost:8001";
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>("/cap_theorm_combined.mp4");

  const handleOpenVideo = async () => {
    setIsOpen(true);
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        title: "cap_theorm",
        description: description || 'The CAP Theorem (CAP) is a fundamental concept in distributed systems that states that it is impossible for a distributed system to simultaneously provide more than two out of three guarantees: Consistency (C), Availability (A), and Partition Tolerance (P). Every system must choose between these properties, and the most recent write cannot guarantee that all nodes contain the most recent data.'
      });
      const response = fetch(`${BASE_URL}/?${params}`, {
        headers: {
          'accept': 'application/json'
        }
      }).then(res => {
        if (!res.ok)
          console.log("Error", res.status)
        
        const videoUrl = fetch(`${BASE_URL}/video/?${params}`, {
          headers: {
            'accept': 'application/json'
          }
        }).then(res => res.json()).then(result => {
          setVideoUrl(result.link);
        })
      })
      
      
      // const blob = await response.blob();
      // const videoUrl = URL.createObjectURL(blob);
      // setVideoUrl(videoUrl);
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
        onClick={() => handleOpenVideo()}
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
              <video
                src="/cap_theorm_combined.mp4"
                className="w-full h-full"
                controls
                autoPlay
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
