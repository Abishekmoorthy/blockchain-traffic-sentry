
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

const statCardVariants = cva(
  "glass-card transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-border",
        primary: "border-primary/30",
        success: "border-green-500/30",
        warning: "border-yellow-500/30",
        danger: "border-red-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatCardProps extends VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  className?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant,
  className,
}: StatCardProps) => {
  return (
    <Card className={cn(statCardVariants({ variant }), className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && (
          <div className={cn(
            "p-2 rounded-full",
            variant === "primary" && "bg-primary/10 text-primary",
            variant === "success" && "bg-green-500/10 text-green-500",
            variant === "warning" && "bg-yellow-500/10 text-yellow-500",
            variant === "danger" && "bg-red-500/10 text-red-500",
            variant === "default" && "bg-secondary text-foreground"
          )}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}>
              {trend.isPositive ? "+" : "-"}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
