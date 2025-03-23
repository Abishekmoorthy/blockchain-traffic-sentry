
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArchitectureLevelProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  children?: React.ReactNode;
}

const ArchitectureLevel = ({
  title,
  description,
  icon: Icon,
  color,
  children
}: ArchitectureLevelProps) => {
  return (
    <Card className={cn("glass-card border-l-4", color)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="mt-1">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default ArchitectureLevel;
