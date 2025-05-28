import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, Car } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getVehicles, addVehicle, updateVehicle, deleteVehicle, getCustomers } from "@/api/api";

interface Vehicle {
  LicensePlate: string;
  CustomerID: number;
  CustomerName?: string;
  Type: string;
  Brand: string;
  Color: string;
  Status?: string;
}

interface Customer {
  CustomerID: number;
  FirstName: string;
  LastName: string;
}

export function VehicleManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [vehicleData, customerData] = await Promise.all([getVehicles(), getCustomers()]);
        const vehiclesWithCustomerName = vehicleData.map(vehicle => {
          const customer = customerData.find(c => c.CustomerID === vehicle.CustomerID);
          return {
            ...vehicle,
            CustomerName: customer ? `${customer.FirstName} ${customer.LastName}` : 'Unknown',
            Status: ['Parked', 'Available', 'Service'][Math.floor(Math.random() * 3)],
          };
        });
        setVehicles(vehiclesWithCustomerName);
        setCustomers(customerData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch vehicles.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch =
      vehicle.LicensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      vehicle.Brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || vehicle.Type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const handleAddVehicle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newVehicle = {
      LicensePlate: formData.get('LicensePlate') as string,
      CustomerID: parseInt(formData.get('CustomerID') as string),
      Type: formData.get('Type') as string,
      Brand: formData.get('Brand') as string,
      Color: formData.get('Color') as string,
    };
    try {
      const addedVehicle = await addVehicle(newVehicle);
      const customer = customers.find(c => c.CustomerID === addedVehicle.CustomerID);
      setVehicles([
        ...vehicles,
        {
          ...addedVehicle,
          CustomerName: customer ? `${customer.FirstName} ${customer.LastName}` : 'Unknown',
          Status: 'Available',
        },
      ]);
      setIsAddDialogOpen(false);
      toast({
        title: "Vehicle Added",
        description: `Vehicle ${newVehicle.LicensePlate} has been added.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add vehicle.",
        variant: "destructive",
      });
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  const handleUpdateVehicle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingVehicle) return;
    const formData = new FormData(event.currentTarget);
    const updatedVehicle = {
      CustomerID: parseInt(formData.get('CustomerID') as string),
      Type: formData.get('Type') as string,
      Brand: formData.get('Brand') as string,
      Color: formData.get('Color') as string,
    };
    try {
      await updateVehicle(editingVehicle.LicensePlate, updatedVehicle);
      const customer = customers.find(c => c.CustomerID === updatedVehicle.CustomerID);
      setVehicles(vehicles.map(v =>
        v.LicensePlate === editingVehicle.LicensePlate
          ? { ...v, ...updatedVehicle, CustomerName: customer ? `${customer.FirstName} ${customer.LastName}` : 'Unknown' }
          : v
      ));
      setIsEditDialogOpen(false);
      setEditingVehicle(null);
      toast({
        title: "Vehicle Updated",
        description: `Vehicle ${editingVehicle.LicensePlate} has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vehicle.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    if (window.confirm(`Are you sure you want to delete vehicle ${vehicle.LicensePlate}?`)) {
      try {
        await deleteVehicle(vehicle.LicensePlate);
        setVehicles(vehicles.filter(v => v.LicensePlate !== vehicle.LicensePlate));
        toast({
          title: "Vehicle Deleted",
          description: `Vehicle ${vehicle.LicensePlate} has been deleted.`,
          variant: "destructive",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete vehicle.",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusColor = (status?: string) => {
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
                <Label htmlFor="LicensePlate">License Plate</Label>
                <Input id="LicensePlate" name="LicensePlate" placeholder="ABC-123" required />
              </div>
              <div>
                <Label htmlFor="CustomerID">Customer</Label>
                <Select name="CustomerID" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.CustomerID} value={customer.CustomerID.toString()}>
                        {customer.FirstName} {customer.LastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="Type">Type</Label>
                  <Select name="Type" required>
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
                  <Label htmlFor="Brand">Brand</Label>
                  <Input id="Brand" name="Brand" placeholder="Toyota" required />
                </div>
              </div>
              <div>
                <Label htmlFor="Color">Color</Label>
                <Input id="Color" name="Color" placeholder="Red" required />
              </div>
              <Button type="submit" className="w-full">Add Vehicle</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
          </DialogHeader>
          {editingVehicle && (
            <form onSubmit={handleUpdateVehicle} className="space-y-4">
              <div>
                <Label>License Plate</Label>
                <Input value={editingVehicle.LicensePlate} disabled />
              </div>
              <div>
                <Label htmlFor="editCustomerID">Customer</Label>
                <Select name="CustomerID" defaultValue={editingVehicle.CustomerID.toString()} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.CustomerID} value={customer.CustomerID.toString()}>
                        {customer.FirstName} {customer.LastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editType">Type</Label>
                  <Select name="Type" defaultValue={editingVehicle.Type} required>
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
                  <Input id="editBrand" name="Brand" defaultValue={editingVehicle.Brand} required />
                </div>
              </div>
              <div>
                <Label htmlFor="editColor">Color</Label>
                <Input id="editColor" name="Color" defaultValue={editingVehicle.Color} required />
              </div>
              <Button type="submit" className="w-full">Update Vehicle</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

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

      {loading ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Loading vehicles...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.LicensePlate} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Car className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{vehicle.LicensePlate}</h3>
                        <Badge className={getStatusColor(vehicle.Status)}>{vehicle.Status}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Owner:</strong> {vehicle.CustomerName} (ID: {vehicle.CustomerID})</p>
                        <p><strong>Vehicle:</strong> {vehicle.Color} {vehicle.Brand} {vehicle.Type}</p>
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
      )}

      {filteredVehicles.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No vehicles found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}