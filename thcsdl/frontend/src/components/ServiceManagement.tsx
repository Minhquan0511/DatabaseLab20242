import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getServices, addService, updateService, deleteService } from "@/api/api"; // <-- Import API functions

interface Service {
  ServiceID: number;
  ServiceName: string;
  ServicePrice: number;
  VehicleType: string;
  activeRegistrations: number;
}

export function ServiceManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const { toast } = useToast();

  // Fetch services from backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch services.",
          variant: "destructive",
        });
      }
    };
    fetchServices();
  }, [toast]);

  const handleAddService = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newService = {
      ServiceName: formData.get('serviceName') as string,
      ServicePrice: parseFloat(formData.get('servicePrice') as string),
      VehicleType: formData.get('vehicleType') as string,
    };
    try {
      const created = await addService(newService);
      setServices(prev => [...prev, { ...created, activeRegistrations: 0 }]);
      setIsAddDialogOpen(false);
      toast({
        title: "Service Added",
        description: `${created.ServiceName} has been added successfully.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add service.",
        variant: "destructive",
      });
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsEditDialogOpen(true);
  };

  const handleUpdateService = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingService) return;
    const formData = new FormData(event.currentTarget);
    const updatedService = {
      ServiceName: formData.get('serviceName') as string,
      ServicePrice: parseFloat(formData.get('servicePrice') as string),
      VehicleType: formData.get('vehicleType') as string,
    };
    try {
      const updated = await updateService(editingService.ServiceID, updatedService);
      setServices(services.map(s =>
        s.ServiceID === editingService.ServiceID ? { ...updated, activeRegistrations: s.activeRegistrations ?? 0 } : s
      ));
      setIsEditDialogOpen(false);
      setEditingService(null);
      toast({
        title: "Service Updated",
        description: `${updated.ServiceName} has been updated successfully.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update service.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (service: Service) => {
    if (window.confirm(`Are you sure you want to delete ${service.ServiceName}?`)) {
      try {
        await deleteService(service.ServiceID);
        setServices(services.filter(s => s.ServiceID !== service.ServiceID));
        toast({
          title: "Service Deleted",
          description: `${service.ServiceName} has been deleted.`,
          variant: "destructive",
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to delete service.",
          variant: "destructive",
        });
      }
    }
  };

  const getVehicleTypeColor = (type: string) => {
    switch (type) {
      case 'Car': return 'bg-blue-100 text-blue-800';
      case 'Motorcycle': return 'bg-purple-100 text-purple-800';
      case 'Electric': return 'bg-green-100 text-green-800';
      case 'All': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <Label htmlFor="serviceName">Service Name</Label>
                <Input id="serviceName" name="serviceName" placeholder="Monthly Parking" required />
              </div>
              <div>
                <Label htmlFor="servicePrice">Price ($)</Label>
                <Input id="servicePrice" name="servicePrice" placeholder="150.00" type="number" step="0.01" required />
              </div>
              <div>
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select name="vehicleType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="All">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Add Service
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          {editingService && (
            <form onSubmit={handleUpdateService} className="space-y-4">
              <div>
                <Label htmlFor="editServiceName">Service Name</Label>
                <Input 
                  id="editServiceName" 
                  name="serviceName" 
                  defaultValue={editingService.ServiceName}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="editServicePrice">Price ($)</Label>
                <Input 
                  id="editServicePrice" 
                  name="servicePrice" 
                  defaultValue={editingService.ServicePrice}
                  type="number" 
                  step="0.01" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="editVehicleType">Vehicle Type</Label>
                <Select name="vehicleType" defaultValue={editingService.VehicleType} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="All">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Update Service
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.ServiceID} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Settings className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{service.ServiceName}</h3>
                      <p className="text-sm text-gray-600">ID: {service.ServiceID}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="text-lg font-bold text-green-600">${service.ServicePrice}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vehicle Type:</span>
                    <Badge className={getVehicleTypeColor(service.VehicleType)}>
                      {service.VehicleType}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Users:</span>
                    <span className="font-medium">{service.activeRegistrations ?? 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monthly Revenue:</span>
                    <span className="font-medium text-green-600">
                      ${(service.ServicePrice * (service.activeRegistrations ?? 0)).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditService(service)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteService(service)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.reduce((sum, service) => sum + (service.activeRegistrations ?? 0), 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${services.reduce((sum, service) => sum + (service.ServicePrice * (service.activeRegistrations ?? 0)), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
