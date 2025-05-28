
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { CustomerManagement } from "@/components/CustomerManagement";
import { VehicleManagement } from "@/components/VehicleManagement";
import { ParkingSpotManagement } from "@/components/ParkingSpotManagement";
import { ServiceManagement } from "@/components/ServiceManagement";
import { EmployeeManagement } from "@/components/EmployeeManagement";
import { TicketManagement } from "@/components/TicketManagement";

export type ActivePage = 'dashboard' | 'customers' | 'vehicles' | 'parking' | 'services' | 'employees' | 'tickets';

const Index = () => {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  console.log('Current active page:', activePage);

  const handlePageChange = (page: ActivePage) => {
    console.log('Changing page to:', page);
    setActivePage(page);
  };

  const renderActivePage = () => {
    console.log('Rendering page:', activePage);
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <CustomerManagement />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'parking':
        return <ParkingSpotManagement />;
      case 'services':
        return <ServiceManagement />;
      case 'employees':
        return <EmployeeManagement />;
      case 'tickets':
        return <TicketManagement />;
      default:
        console.warn('Unknown page:', activePage);
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar activePage={activePage} setActivePage={handlePageChange} />
        <main className="flex-1 p-6">
          {renderActivePage()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
