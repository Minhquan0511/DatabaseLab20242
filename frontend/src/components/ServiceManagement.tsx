
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Service {
  serviceID: number;
  serviceName: string;
  servicePrice: number;
  vehicleType: string;
  activeRegistrations: number;
}

export function ServiceManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Mock data
  const [services] = useState<Service[]>([
    { serviceID: 1, serviceName: "Monthly Parking", servicePrice: 150.00, vehicleType: "Car", activeRegistrations: 45 },
    { serviceID: 2, serviceName: "Daily Parking", servicePrice: 15.00, vehicleType: "Car", activeRegistrations: 123 },
    { serviceID: 3, serviceName: "Motorcycle Parking", servicePrice: 8.00, vehicleType: "Motorcycle", activeRegistrations: 28 },
    { serviceID: 4, serviceName: "Electric Vehicle Charging", servicePrice: 25.00, vehicleType: "Electric", activeRegistrations: 12 },
    { serviceID: 5, serviceName: "Premium Parking", servicePrice: 200.00, vehicleType: "Car", activeRegistrations: 18 },
    { serviceID: 6, serviceName: "Overnight Parking", servicePrice: 20.00, vehicleType: "All", activeRegistrations: 67 },
  ]);

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
            <div className="space-y-4">
              <div>
                <Label htmlFor="serviceName">Service Name</Label>
                <Input id="serviceName" placeholder="Monthly Parking" />
              </div>
              <div>
                <Label htmlFor="servicePrice">Price ($)</Label>
                <Input id="servicePrice" placeholder="150.00" type="number" step="0.01" />
              </div>
              <div>
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={() => setIsAddDialogOpen(false)}>
                Add Service
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.serviceID} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Settings className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{service.serviceName}</h3>
                      <p className="text-sm text-gray-600">ID: {service.serviceID}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="text-lg font-bold text-green-600">${service.servicePrice}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vehicle Type:</span>
                    <Badge className={getVehicleTypeColor(service.vehicleType)}>
                      {service.vehicleType}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Users:</span>
                    <span className="font-medium">{service.activeRegistrations}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monthly Revenue:</span>
                    <span className="font-medium text-green-600">
                      ${(service.servicePrice * service.activeRegistrations).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
              {services.reduce((sum, service) => sum + service.activeRegistrations, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${services.reduce((sum, service) => sum + (service.servicePrice * service.activeRegistrations), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
