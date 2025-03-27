
import { 
  LayoutDashboard, 
  Activity, 
  ShieldAlert, 
  Blocks, 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  Cpu,
  Wifi,
  WifiOff
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  useSidebar 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRealTimeUpdates } from "@/services/realTimeService";

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Traffic Monitoring",
    path: "/traffic",
    icon: Activity,
  },
  {
    title: "Security Logs",
    path: "/security",
    icon: ShieldAlert,
  },
  {
    title: "Blockchain Status",
    path: "/blockchain",
    icon: Blocks,
  },
  {
    title: "IoT Components",
    path: "/components",
    icon: Cpu,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  }
];

const AppSidebar = () => {
  const sidebar = useSidebar();
  const [mounted, setMounted] = useState(false);
  const { status: connectionStatus } = useRealTimeUpdates({});

  // Ensure hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-3 py-4">
            {!sidebar.collapsed && (
              <div className="flex items-center gap-2 px-2">
                <ShieldAlert className="h-6 w-6 text-primary" />
                <span className="font-medium">Traffic Security</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => sidebar.setCollapsed(!sidebar.collapsed)}
              className="ml-auto"
            >
              {sidebar.collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => 
                        `flex items-center gap-2 ${isActive ? "text-primary" : ""}`
                      }
                      end={item.path === "/"}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        {!sidebar.collapsed && (
          <div className="glass-card p-3 rounded-lg">
            <div className="text-xs text-muted-foreground">System Status</div>
            <div className="mt-2 flex items-center">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm">Blockchain Secure</span>
            </div>
            <div className="mt-2 flex items-center">
              {connectionStatus === 'connected' ? (
                <>
                  <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-sm flex items-center gap-1">
                    <Wifi className="h-3 w-3" /> Live Data Active
                  </span>
                </>
              ) : (
                <>
                  <span className="flex h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                  <span className="text-sm flex items-center gap-1">
                    <WifiOff className="h-3 w-3" /> Using Cached Data
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
