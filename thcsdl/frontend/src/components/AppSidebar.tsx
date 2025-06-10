
import { Car, Users, MapPin, Settings, UserCheck, Ticket, LayoutDashboard, ParkingMeter, LogOut } from "lucide-react";
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
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { ActivePage } from "@/pages/Index";
import { useAuth } from "@/contexts/AuthContext";

interface AppSidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    page: 'dashboard' as ActivePage,
  },
  {
    title: "Customers",
    icon: Users,
    page: 'customers' as ActivePage,
  },
  {
    title: "Vehicles",
    icon: Car,
    page: 'vehicles' as ActivePage,
  },
  {
    title: "Parking Spots",
    icon: MapPin,
    page: 'parking' as ActivePage,
  },
  {
    title: "Services",
    icon: Settings,
    page: 'services' as ActivePage,
  },
  {
    title: "Employees",
    icon: UserCheck,
    page: 'employees' as ActivePage,
  },
  {
    title: "Tickets",
    icon: Ticket,
    page: 'tickets' as ActivePage,
  },
];

export function AppSidebar({ activePage, setActivePage }: AppSidebarProps) {
  const { logout, user } = useAuth();

  const handleMenuClick = (page: ActivePage) => {
    console.log('Menu clicked:', page);
    setActivePage(page);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <ParkingMeter className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg">ParkManager</span>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => handleMenuClick(item.page)}
                    isActive={activePage === item.page}
                    className="hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-200 p-4">
        <div className="text-sm text-gray-600 mb-2">
          Logged in as: {user?.email}
        </div>
        <SidebarMenuButton 
          onClick={handleLogout}
          className="hover:bg-red-50 hover:text-red-700 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
