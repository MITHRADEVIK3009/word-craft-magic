import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Bell,
  Menu,
  Building2,
  LayoutDashboard,
  FileText,
  Users,
  User,
  Shield,
  Database
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AppSidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userRole: string;
}

export function AppSidebar({ currentPage, setCurrentPage, userRole }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      id: "dashboard"
    },
    {
      title: "Applications",
      icon: FileText,
      id: "applications"
    },
    {
      title: "Certificates",
      icon: Building2,
      id: "certificates"
    },
    {
      title: "Automation",
      icon: Bell,
      id: "automation"
    },
    {
      title: "Community",
      icon: Users,
      id: "community"
    },
    {
      title: "Profile",
      icon: User,
      id: "profile"
    },
    {
      title: "Notifications",
      icon: Bell,
      id: "notifications"
    },
    {
      title: "System Check",
      icon: Database,
      id: "database-test"
    }
  ];

  // Add admin items if user is admin
  if (userRole === 'admin') {
    menuItems.push({
      title: "Admin Dashboard",
      icon: Shield,
      id: "admin"
    });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 border-r p-0">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle>SPARK</SheetTitle>
          <SheetDescription>
            Smart Public Auto Record Keeper
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="py-4">
            <div className="px-6">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div className="space-y-0.5 mt-2">
                <p className="text-sm font-medium text-yellow-400">
                  shadcn
                </p>
                <Badge variant="secondary">
                  Admin
                </Badge>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.title}
                  variant="ghost"
                  className={`w-full justify-start font-normal ${currentPage === item.id ? 'bg-secondary' : ''}`}
                  onClick={() => setCurrentPage(item.id)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
