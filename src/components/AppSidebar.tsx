
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const menuItems = [
  { id: 'dashboard', label: 'Command Center', icon: '🏠', gradient: 'from-cyan-500 to-blue-500' },
  { id: 'applications', label: 'Applications', icon: '📋', gradient: 'from-blue-500 to-purple-500' },
  { id: 'certificates', label: 'Digital Certificates', icon: '📜', gradient: 'from-purple-500 to-pink-500' },
  { id: 'automation', label: 'AI Automation', icon: '⚙️', gradient: 'from-green-500 to-cyan-500' },
  { id: 'community', label: 'Community Hub', icon: '👥', gradient: 'from-orange-500 to-red-500' },
  { id: 'profile', label: 'User Profile', icon: '👤', gradient: 'from-indigo-500 to-purple-500' },
];

const adminItems = [
  { id: 'admin', label: 'Admin Control', icon: '🔧', gradient: 'from-red-500 to-orange-500' },
];

interface AppSidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userRole: string;
}

export function AppSidebar({ currentPage, setCurrentPage, userRole }: AppSidebarProps) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Sidebar className="border-r border-cyan-500/20 bg-gradient-to-b from-slate-900/95 to-blue-900/95 backdrop-blur-xl">
      <SidebarHeader className="p-6 relative">
        {/* Header glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent rounded-lg"></div>
        
        <div className="text-center relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl shadow-cyan-500/50 ring-4 ring-cyan-400/20">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            SPARK
          </h2>
          <p className="text-xs text-cyan-300/80 mt-1">Smart Public Auto Record Keeper</p>
          
          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 mt-3 px-3 py-1 bg-slate-800/50 rounded-full border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-xs">Online</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-cyan-400/80 text-xs font-semibold tracking-wider uppercase mb-4">
            Main Systems
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                      currentPage === item.id 
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105` 
                        : 'text-cyan-200 hover:bg-slate-800/50 hover:scale-105 border border-transparent hover:border-cyan-500/20'
                    }`}
                  >
                    {/* Button glow effect when active */}
                    {currentPage === item.id && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 blur-xl`}></div>
                    )}
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        currentPage === item.id 
                          ? 'bg-white/20' 
                          : 'bg-slate-800/50 group-hover:bg-cyan-500/20'
                      }`}>
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div>
                        <span className="font-medium">{item.label}</span>
                        {currentPage === item.id && (
                          <div className="w-full h-0.5 bg-white/50 mt-1 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    {/* Animated border */}
                    {currentPage === item.id && (
                      <div className="absolute inset-0 rounded-xl border border-white/20"></div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {userRole === 'admin' && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="text-red-400/80 text-xs font-semibold tracking-wider uppercase mb-4">
              Administrative
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => setCurrentPage(item.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                        currentPage === item.id 
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105` 
                          : 'text-cyan-200 hover:bg-slate-800/50 hover:scale-105 border border-transparent hover:border-red-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          currentPage === item.id 
                            ? 'bg-white/20' 
                            : 'bg-slate-800/50 group-hover:bg-red-500/20'
                        }`}>
                          <span className="text-lg">{item.icon}</span>
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button 
          onClick={handleSignOut}
          className="w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-red-600 hover:to-red-700 border border-cyan-500/20 text-cyan-200 hover:text-white transition-all duration-300 rounded-xl p-3 font-medium shadow-lg hover:shadow-red-500/20 hover:scale-105"
        >
          <span className="mr-2">🚪</span>
          Secure Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
