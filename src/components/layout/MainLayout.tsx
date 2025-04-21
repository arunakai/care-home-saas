import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { AuthProvider } from '@/lib/auth/auth-context';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthProvider>
      <div className="flex h-screen bg-gray-50">
        <Navbar onToggleSidebar={toggleSidebar} />
        <Sidebar isOpen={sidebarOpen} />
        
        <div className="bg-gray-50 flex-1 pt-16 overflow-y-auto">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="relative">
              {/* Overlay for mobile when sidebar is open */}
              {sidebarOpen && (
                <div 
                  className="fixed inset-0 z-10 bg-gray-900 opacity-50 lg:hidden"
                  onClick={toggleSidebar}
                ></div>
              )}
              
              <main className="lg:pl-64 transition-all duration-200">
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
