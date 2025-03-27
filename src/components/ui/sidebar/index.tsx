
import * as React from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON, SIDEBAR_WIDTH_MOBILE } from "./constants"
import { SidebarContext, SidebarProvider as OriginalSidebarProvider, useSidebar, type SidebarProviderProps } from "./context"
import { 
  Sidebar, 
  SidebarTrigger, 
  SidebarRail,
  SidebarInset,
} from "./sidebar-core"
import {
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarInput
} from "./sidebar-sections"
import { 
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel
} from "./sidebar-group"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuSkeleton
} from "./sidebar-menu"
import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "./sidebar-submenu"

// Re-export everything for backward compatibility
export {
  // Constants
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_MOBILE,
  SIDEBAR_WIDTH_ICON,
  // Context
  SidebarContext,
  useSidebar,
  // Core components
  Sidebar,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  // Section components
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarInput,
  // Group components
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  // Menu components
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  // Submenu components
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
}

// Export type separately when isolatedModules is enabled
export type { SidebarProviderProps };

// Create a wrapped version of SidebarProvider that includes TooltipProvider
const WrappedSidebarProvider = React.forwardRef<
  HTMLDivElement,
  SidebarProviderProps
>(({ children, className, style, ...props }, ref) => {
  return (
    <OriginalSidebarProvider 
      ref={ref}
      className={className}
      style={{
        "--sidebar-width": SIDEBAR_WIDTH,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        ...style,
      } as React.CSSProperties}
      {...props}
    >
      <TooltipProvider delayDuration={0}>
        <div className="group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar">
          {children}
        </div>
      </TooltipProvider>
    </OriginalSidebarProvider>
  )
})
WrappedSidebarProvider.displayName = "SidebarProvider"

// Export the wrapped version as SidebarProvider
export { WrappedSidebarProvider as SidebarProvider }
