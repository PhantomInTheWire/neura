import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Book } from "lucide-react";

interface WorkspaceCardProps {
  id: string;
  title: string;
  dateCreated: string;
  sources: string[];
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  title,
  dateCreated,
  sources,
}) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Book className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date(dateCreated).toLocaleDateString()}
        </div>
        <div className="flex flex-wrap gap-2">
          {sources.map((source, index) => (
            <Badge key={index} variant="secondary">
              {source}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkspaceCard;
