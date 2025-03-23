
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import Header from "./Header";
import { useState, useEffect } from "react";

const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin-slow"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-primary/70 animate-spin-slow" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-4 rounded-full border-b-2 border-primary/50 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-medium text-primary">Loading</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full bg-background text-foreground">
      <Header />
      <div className="flex flex-1 w-full">
        <AppSidebar />
        <main className="flex-1 p-0 transition-all duration-300 ease-in-out overflow-x-hidden">
          <div className="container mx-auto py-4 px-4 md:px-6 animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
