
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type HardwareCategory = 'sensor' | 'actuator' | 'controller' | 'communication';

interface HardwareItemProps {
  name: string;
  description: string;
  icon: LucideIcon;
  category: HardwareCategory;
  specifications?: string[];
  quantity?: number;
}

const HardwareItem = ({
  name,
  description,
  icon: Icon,
  category,
  specifications = [],
  quantity = 1
}: HardwareItemProps) => {
  const categoryColors = {
    sensor: "bg-blue-500/10 text-blue-500",
    actuator: "bg-green-500/10 text-green-500",
    controller: "bg-purple-500/10 text-purple-500",
    communication: "bg-yellow-500/10 text-yellow-500"
  };

  const categoryLabels = {
    sensor: "Sensor",
    actuator: "Actuator",
    controller: "Controller",
    communication: "Communication"
  };

  return (
    <Card className="glass-card h-full flex flex-col transition-transform duration-300 hover:scale-[1.01]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-medium flex items-center gap-2">
            <div className={cn("p-2 rounded-full", categoryColors[category])}>
              <Icon className="h-5 w-5" />
            </div>
            {name}
          </CardTitle>
          {quantity > 1 && (
            <Badge variant="outline" className="text-xs">
              x{quantity}
            </Badge>
          )}
        </div>
        <Badge
          className={cn("mt-1 font-normal", 
            category === 'sensor' && "bg-blue-500/20 text-blue-600 hover:bg-blue-500/30",
            category === 'actuator' && "bg-green-500/20 text-green-600 hover:bg-green-500/30",
            category === 'controller' && "bg-purple-500/20 text-purple-600 hover:bg-purple-500/30",
            category === 'communication' && "bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30",
          )}
        >
          {categoryLabels[category]}
        </Badge>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4 pt-0 flex-grow">
        {specifications.length > 0 && (
          <div className="mt-2">
            <h4 className="text-xs font-medium text-muted-foreground mb-1">Specifications:</h4>
            <ul className="text-sm space-y-1">
              {specifications.map((spec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary text-xs mr-2 mt-1">•</span>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HardwareItem;
