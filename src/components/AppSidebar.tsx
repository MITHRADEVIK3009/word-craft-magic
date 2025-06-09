
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
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'applications', label: 'Applications', icon: '📋' },
  { id: 'certificates', label: 'Certificates', icon: '📜' },
  { id: 'automation', label: 'Automation', icon: '⚙️' },
  { id: 'community', label: 'Community', icon: '👥' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

const adminItems = [
  { id: 'admin', label: 'Admin Panel', icon: '🔧' },
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
    <Sidebar className="border-r border-gray-700 bg-gray-800">
      <SidebarHeader className="p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-yellow-400">SPARK</h2>
          <p className="text-xs text-gray-400">Smart Public Auto Record Keeper</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentPage === item.id 
                        ? 'bg-yellow-400 text-gray-900' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {userRole === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400">Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => setCurrentPage(item.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentPage === item.id 
                          ? 'bg-yellow-400 text-gray-900' 
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
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
          variant="outline" 
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
