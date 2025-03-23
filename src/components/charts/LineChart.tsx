
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

interface DataPoint {
  timestamp: string;
  [key: string]: number | string;
}

interface LineChartProps {
  data: DataPoint[];
  lines: Array<{
    dataKey: string;
    color: string;
    name?: string;
  }>;
  title: string;
  description?: string;
  className?: string;
  xAxisDataKey?: string;
  yAxisLabel?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-2 rounded-md shadow-lg border border-white/10">
        <p className="text-xs text-foreground/80 font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={`item-${index}`}
            className="text-xs"
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const LineChart = ({
  data,
  lines,
  title,
  description,
  className,
  xAxisDataKey = "timestamp",
  yAxisLabel,
}: LineChartProps) => {
  return (
    <Card className={cn("glass-card overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey={xAxisDataKey} 
                stroke="rgba(255,255,255,0.5)" 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)" 
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                label={yAxisLabel ? { 
                  value: yAxisLabel, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'rgba(255,255,255,0.5)', fontSize: 12 }
                } : undefined}
              />
              <Tooltip content={<CustomTooltip />} />
              {lines.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  name={line.name || line.dataKey}
                  stroke={line.color}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChart;
