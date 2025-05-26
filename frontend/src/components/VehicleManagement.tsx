
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Car } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Vehicle {
  licensePlate: string;
  customerID: number;
  customerName: string;
  type: string;
  brand: string;
  color: string;
  status: 'Parked' | 'Available' | 'Service';
}

export function VehicleManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();

  // Mock data
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { licensePlate: "ABC-123", customerID: 1, customerName: "John Doe", type: "Car", brand: "Toyota", color: "Red", status: "Parked" },
    { licensePlate: "XYZ-789", customerID: 2, customerName: "Jane Smith", type: "SUV", brand: "Honda", color: "Blue", status: "Available" },
    { licensePlate: "DEF-456", customerID: 3, customerName: "Mike Johnson", type: "Motorcycle", brand: "Yamaha", color: "Black", status: "Service" },
    { licensePlate: "GHI-321", customerID: 1, customerName: "John Doe", type: "Car", brand: "Ford", color: "White", status: "Parked" },
  ]);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || vehicle.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const handleAddVehicle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newVehicle: Vehicle = {
      licensePlate: formData.get('licensePlate') as string,
      customerID: parseInt(formData.get('customerID') as string),
      customerName: "Customer Name", // In real app, fetch from customer ID
      type: formData.get('type') as string,
      brand: formData.get('brand') as string,
      color: formData.get('color') as string,
      status: 'Available',
    };
    setVehicles([...vehicles, newVehicle]);
    setIsAddDialogOpen(false);
    toast({
      title: "Vehicle Added",
      description: `Vehicle ${newVehicle.licensePlate} has been added successfully.`,
    });
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  const handleUpdateVehicle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingVehicle) return;
    
    const formData = new FormData(event.currentTarget);
    const updatedVehicle: Vehicle = {
      ...editingVehicle,
      customerID: parseInt(formData.get('customerID') as string),
      type: formData.get('type') as string,
      brand: formData.get('brand') as string,
      color: formData.get('color') as string,
    };
    
    setVehicles(vehicles.map(v => 
      v.licensePlate === editingVehicle.licensePlate ? updatedVehicle : v
    ));
    setIsEditDialogOpen(false);
    setEditingVehicle(null);
    toast({
      title: "Vehicle Updated",
      description: `Vehicle ${updatedVehicle.licensePlate} has been updated successfully.`,
    });
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    if (window.confirm(`Are you sure you want to delete vehicle ${vehicle.licensePlate}?`)) {
      setVehicles(vehicles.filter(v => v.licensePlate !== vehicle.licensePlate));
      toast({
        title: "Vehicle Deleted",
        description: `Vehicle ${vehicle.licensePlate} has been deleted.`,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Parked': return 'bg-red-100 text-red-800';
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Service': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input id="licensePlate" name="licensePlate" placeholder="ABC-123" required />
              </div>
              <div>
                <Label htmlFor="customerID">Customer ID</Label>
                <Input id="customerID" name="customerID" placeholder="1" type="number" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" name="brand" placeholder="Toyota" required />
                </div>
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input id="color" name="color" placeholder="Red" required />
              </div>
              <Button type="submit" className="w-full">
                Add Vehicle
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
          </DialogHeader>
          {editingVehicle && (
            <form onSubmit={handleUpdateVehicle} className="space-y-4">
              <div>
                <Label>License Plate</Label>
                <Input value={editingVehicle.licensePlate} disabled />
              </div>
              <div>
                <Label htmlFor="editCustomerID">Customer ID</Label>
                <Input 
                  id="editCustomerID" 
                  name="customerID" 
                  defaultValue={editingVehicle.customerID}
                  type="number" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editType">Type</Label>
                  <Select name="type" defaultValue={editingVehicle.type} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="Truck">Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editBrand">Brand</Label>
                  <Input 
                    id="editBrand" 
                    name="brand" 
                    defaultValue={editingVehicle.brand}
                    required 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editColor">Color</Label>
                <Input 
                  id="editColor" 
                  name="color" 
                  defaultValue={editingVehicle.color}
                  required 
                />
              </div>
              <Button type="submit" className="w-full">
                Update Vehicle
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by license plate, customer, or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Grid */}
      <div className="grid gap-4">
        {filteredVehicles.map((vehicle) => (
          <Card key={vehicle.licensePlate} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{vehicle.licensePlate}</h3>
                      <Badge className={getStatusColor(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Owner:</strong> {vehicle.customerName} (ID: {vehicle.customerID})</p>
                      <p><strong>Vehicle:</strong> {vehicle.color} {vehicle.brand} {vehicle.type}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditVehicle(vehicle)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteVehicle(vehicle)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No vehicles found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
