
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SecurityChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  title: string;
  description?: string;
  className?: string;
}

const SecurityChart = ({
  data,
  title,
  description,
  className,
}: SecurityChartProps) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className={cn("glass-card overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} (${((value / total) * 100).toFixed(1)}%)`, '']}
                contentStyle={{ 
                  backgroundColor: 'rgba(17, 24, 39, 0.85)', 
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.5rem',
                  backdropFilter: 'blur(8px)'
                }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                formatter={(value) => <span className="text-xs text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityChart;
