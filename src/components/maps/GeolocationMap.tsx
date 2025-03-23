
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Compass } from "lucide-react";

interface GeolocationMapProps {
  title: string;
  description?: string;
  className?: string;
  locations?: Array<{
    id: string;
    name: string;
    type: string;
    status: 'active' | 'inactive' | 'warning';
  }>;
}

const GeolocationMap = ({
  title,
  description,
  className,
  locations = [],
}: GeolocationMapProps) => {
  return (
    <Card className={cn("glass-card overflow-hidden", className)}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Compass className="h-3 w-3" />
            <span>Global</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px] w-full rounded-md overflow-hidden border border-border/50">
          {/* World map container */}
          <div className="absolute inset-0 bg-blue-900/10">
            {/* Simple world map SVG (simplified) */}
            <svg
              className="w-full h-full opacity-30"
              viewBox="0 0 800 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M673.5,282.9c0,0-13.4,5.4-13.4,8.1s4,8.7,4,8.7L659.5,310l-10.7,8.1l-66.9-13.4l-33.5-40.2l-33.5-55.6l-22.8-48.2
                l2.7-25.4l-12.1-25.4l-22.8-8.1l-44.1,4l-53.5,23.5l-34.8,29.5l-27.5,32.1l-55.6,31.5l-34.8,8.1l-72.3-10.7l-41.5-18.8l-50.8-18.8
                l1.3-70.9l22.8-17.4h34.8l47.5,16.1l66.3,29.5l47.5,10.7l57,1.3l51.5-6.7l59-31.5l47.5-50.8l20.1-38.8l37.5-7.6l33.5-18.8l
                18.8-12.1h29.5l26.8,12.1l14.1,16.1v18.8l-8.1,30.8l-2.7,30.8l-16.1,19.4l-18.8,12.1l-8.1,19.4l-2.7,18.8l4,21.4v31.5l8.1,19.4
                l16.1,14.8h16.1l14.8,13.4l2.7,24.1l-13.4,35.5L673.5,282.9z" 
                stroke="currentColor" 
                strokeWidth="1.5"
              />
              <path 
                d="M157.5,109.5l-20.5,14.5l-2,20l19,13l34-2l32.5-27l-5-28l-16-15.5l-18.5,2L157.5,109.5z" 
                stroke="currentColor" 
                strokeWidth="1.5"
              />
              <path 
                d="M173,223l-17,44.5l10,22l31,13.5l24.5-5.5l37-38.5l28.5-66l-2-37.5l-29-3l-34.5,20l-36,23.5L173,223z" 
                stroke="currentColor" 
                strokeWidth="1.5"
              />
            </svg>
            
            {/* Location dots */}
            <div className="absolute top-[30%] left-[20%]">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            </div>
            
            <div className="absolute top-[45%] left-[45%]">
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
            </div>
            
            <div className="absolute top-[25%] left-[70%]">
              <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
            </div>
            
            <div className="absolute top-[60%] left-[55%]">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            </div>
          </div>
          
          {/* Map overlay - grid lines */}
          <div className="absolute inset-0">
            <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-white/5"></div>
              ))}
            </div>
          </div>
          
          {/* Map legend */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/40 p-2 flex justify-center gap-4">
            <div className="flex items-center gap-1 text-xs">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="h-2 w-2 bg-yellow-500 rounded-full"></span>
              <span>Warning</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="h-2 w-2 bg-red-500 rounded-full"></span>
              <span>Alert</span>
            </div>
          </div>
        </div>
        
        {locations.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium">Connected Locations</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {locations.map((location) => (
                <div 
                  key={location.id}
                  className="p-2 bg-secondary/30 border border-white/10 rounded-md flex items-center justify-between"
                >
                  <div className="text-xs">
                    <div className="font-medium">{location.name}</div>
                    <div className="text-muted-foreground">{location.type}</div>
                  </div>
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    location.status === "active" && "bg-green-500",
                    location.status === "inactive" && "bg-red-500",
                    location.status === "warning" && "bg-yellow-500",
                  )}></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeolocationMap;
