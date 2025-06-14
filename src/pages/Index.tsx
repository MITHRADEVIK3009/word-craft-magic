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
import { AutomationDashboard } from "@/components/AutomationDashboard";
import { supabase } from "@/integrations/supabase/client";
import { DocumentUpload } from "@/components/DocumentUpload";
import { NotificationSystem } from "@/components/NotificationSystem";
import { LanguageSelector } from "@/components/LanguageSelector";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-cyan-500/20 rounded-full blur-lg animate-pulse delay-300"></div>
          <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-700"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-blue-400/20 rounded-full blur-lg animate-pulse delay-1000"></div>
        </div>
        
        <div className="text-center z-10">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4 shadow-lg shadow-cyan-500/50"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-md"></div>
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
            SPARK Platform
          </h1>
          <p className="text-cyan-300 text-xl font-semibold animate-pulse">Initializing Smart Systems...</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
          </div>
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
        return (
          <div className="space-y-6">
            <ApplicationsPage />
            <DocumentUpload />
          </div>
        );
      case 'certificates':
        return <CertificatesPage />;
      case 'automation':
        return <AutomationDashboard />;
      case 'community':
        return <CommunityPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminDashboard />;
      case 'notifications':
        return <NotificationSystem />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, cyan 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Floating orbs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <SidebarProvider>
        <div className="flex w-full min-h-screen relative z-10">
          <AppSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} userRole="citizen" />
          <SidebarInset className="flex-1">
            <header className="bg-gradient-to-r from-slate-800/80 to-blue-900/80 backdrop-blur-xl border-b border-cyan-500/20 p-4 flex items-center justify-between relative">
              {/* Header glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <SidebarTrigger className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 hover:scale-110" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                      SPARK
                    </h1>
                    <p className="text-xs text-cyan-300/80">Smart Public Auto Record Keeper</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 relative z-10">
                <LanguageSelector />
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full border border-cyan-500/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-cyan-300 text-sm">System Online</span>
                </div>
                <span className="text-cyan-200">Welcome, {user.email}</span>
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400/20">
                  <span className="text-slate-900 font-bold text-lg">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </header>
            <main className="p-6 relative z-10">
              {renderPage()}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;
