
import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { LoginPage } from "@/components/LoginPage";
import { Dashboard } from "@/components/Dashboard";
import { ApplicationsPage } from "@/components/ApplicationsPage";
import { CertificatesPage } from "@/components/CertificatesPage";
import { CommunityPage } from "@/components/CommunityPage";
import { ProfilePage } from "@/components/ProfilePage";
import { AdminDashboard } from "@/components/AdminDashboard";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-yellow-400 text-xl font-semibold">Loading SPARK Platform...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'applications':
        return <ApplicationsPage />;
      case 'certificates':
        return <CertificatesPage />;
      case 'community':
        return <CommunityPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} userRole="citizen" />
          <SidebarInset className="flex-1">
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-yellow-400 hover:text-yellow-300" />
                <h1 className="text-2xl font-bold text-yellow-400">
                  SPARK - Smart Public Auto Record Keeper
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-300">Welcome, {user.email}</span>
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </header>
            <main className="p-6">
              {renderPage()}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
