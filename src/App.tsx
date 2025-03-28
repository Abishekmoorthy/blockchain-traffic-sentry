
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "./pages/Dashboard";
import TrafficMonitoring from "./pages/TrafficMonitoring";
import SecurityLogs from "./pages/SecurityLogs";
import BlockchainStatus from "./pages/BlockchainStatus";
import IoTComponents from "./pages/IoTComponents";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { TrafficProvider } from "./contexts/TrafficContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider defaultCollapsed={false}>
        <TrafficProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="/traffic" element={<TrafficMonitoring />} />
                <Route path="/security" element={<SecurityLogs />} />
                <Route path="/blockchain" element={<BlockchainStatus />} />
                <Route path="/components" element={<IoTComponents />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TrafficProvider>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
