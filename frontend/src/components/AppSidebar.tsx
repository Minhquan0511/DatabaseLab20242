
import { Car, Users, MapPin, Settings, UserCheck, Ticket, LayoutDashboard, ParkingMeter } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { ActivePage } from "@/pages/Index";

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
                    onClick={() => setActivePage(item.page)}
                    isActive={activePage === item.page}
                    className="hover:bg-blue-50 hover:text-blue-700"
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
    </Sidebar>
  );
}
