
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";

interface AppSidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userRole?: string;
}

export function AppSidebar({ currentPage, setCurrentPage, userRole }: AppSidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'AI insights & overview',
      icon: '📊'
    },
    {
      id: 'applications',
      title: 'Applications',
      description: 'Track submissions',
      icon: '📝'
    },
    {
      id: 'certificates',
      title: 'Certificates',
      description: 'Blockchain verified',
      icon: '🏆'
    },
    {
      id: 'community',
      title: 'Community',
      description: 'Support & discussions',
      icon: '👥'
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'Account settings',
      icon: '👤'
    }
  ];

  if (userRole === 'admin') {
    menuItems.push({
      id: 'admin',
      title: 'Admin Dashboard',
      description: 'System monitoring',
      icon: '⚙️'
    });
  }

  return (
    <Sidebar className="bg-gray-900 border-r border-gray-700">
      <SidebarHeader className="p-6">
        <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 p-4">
          <h2 className="text-xl font-bold">SPARK</h2>
          <p className="text-sm opacity-80">Smart Public Auto Record Keeper</p>
        </Card>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-yellow-400 text-lg font-semibold px-4 py-2">
            Services
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setCurrentPage(item.id)}
                    isActive={currentPage === item.id}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                      currentPage === item.id
                        ? 'bg-yellow-400 text-gray-900 shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-yellow-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-sm opacity-70">{item.description}</div>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Card className="bg-gray-800 border-gray-700 p-4">
          <div className="text-center">
            <div className="text-yellow-400 font-semibold">System Status</div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Online</span>
            </div>
          </div>
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
}
