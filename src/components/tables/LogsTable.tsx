
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Log {
  id: string;
  timestamp: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  source: string;
}

interface LogsTableProps {
  logs: Log[];
  title: string;
  description?: string;
  className?: string;
}

const LogsTable = ({
  logs,
  title,
  description,
  className,
}: LogsTableProps) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Shield className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <Badge variant="destructive">Critical</Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-yellow-500">Warning</Badge>
        );
      case 'info':
      default:
        return (
          <Badge className="bg-blue-500">Info</Badge>
        );
    }
  };

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="animate-slideIn hover:bg-secondary/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(log.severity)}
                      <span className="hidden sm:inline">
                        {getSeverityBadge(log.severity)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.timestamp}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {log.message}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-secondary/50">
                      {log.source}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogsTable;
