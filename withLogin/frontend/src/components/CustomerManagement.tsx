import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getCustomers, addCustomer, updateCustomer, deleteCustomer, getVehicles } from "@/api/api";

interface Customer {
  CustomerID: number;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Address: string;
  VehicleCount?: number;
}

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [customerData, vehicleData] = await Promise.all([getCustomers(), getVehicles()]);
        const customersWithVehicleCount = customerData.map(customer => ({
          ...customer,
          VehicleCount: vehicleData.filter(v => v.CustomerID === customer.CustomerID).length,
        }));
        setCustomers(customersWithVehicleCount);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch customers.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    `${customer.FirstName} ${customer.LastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.PhoneNumber.includes(searchTerm)
  );

  const handleAddCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newCustomer = {
      FirstName: formData.get('FirstName') as string,
      LastName: formData.get('LastName') as string,
      PhoneNumber: formData.get('PhoneNumber') as string,
      Address: formData.get('Address') as string,
    };
    try {
      const addedCustomer = await addCustomer(newCustomer);
      setCustomers([...customers, { ...addedCustomer, VehicleCount: 0 }]);
      setIsAddDialogOpen(false);
      toast({
        title: "Customer Added",
        description: `${newCustomer.FirstName} ${newCustomer.LastName} has been added.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add customer.",
        variant: "destructive",
      });
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCustomer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingCustomer) return;
    const formData = new FormData(event.currentTarget);
    const updatedCustomer = {
      FirstName: formData.get('FirstName') as string,
      LastName: formData.get('LastName') as string,
      PhoneNumber: formData.get('PhoneNumber') as string,
      Address: formData.get('Address') as string,
    };
    try {
      await updateCustomer(editingCustomer.CustomerID, updatedCustomer);
      setCustomers(customers.map(c =>
        c.CustomerID === editingCustomer.CustomerID ? { ...c, ...updatedCustomer } : c
      ));
      setIsEditDialogOpen(false);
      setEditingCustomer(null);
      toast({
        title: "Customer Updated",
        description: `${updatedCustomer.FirstName} ${updatedCustomer.LastName} has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.FirstName} ${customer.LastName}?`)) {
      try {
        await deleteCustomer(customer.CustomerID);
        setCustomers(customers.filter(c => c.CustomerID !== customer.CustomerID));
        toast({
          title: "Customer Deleted",
          description: `${customer.FirstName} ${customer.LastName} has been deleted.`,
          variant: "destructive",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete customer.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="FirstName">First Name</Label>
                  <Input id="FirstName" name="FirstName" placeholder="John" required />
                </div>
                <div>
                  <Label htmlFor="LastName">Last Name</Label>
                  <Input id="LastName" name="LastName" placeholder="Doe" required />
                </div>
              </div>
              <div>
                <Label htmlFor="PhoneNumber">Phone Number</Label>
                <Input id="PhoneNumber" name="PhoneNumber" placeholder="555-0123" required />
              </div>
              <div>
                <Label htmlFor="Address">Address</Label>
                <Input id="Address" name="Address" placeholder="123 Main St" required />
              </div>
              <Button type="submit" className="w-full">Add Customer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <form onSubmit={handleUpdateCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input
                    id="editFirstName"
                    name="FirstName"
                    defaultValue={editingCustomer.FirstName}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input
                    id="editLastName"
                    name="LastName"
                    defaultValue={editingCustomer.LastName}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editPhoneNumber">Phone Number</Label>
                <Input
                  id="editPhoneNumber"
                  name="PhoneNumber"
                  defaultValue={editingCustomer.PhoneNumber}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editAddress">Address</Label>
                <Input
                  id="editAddress"
                  name="Address"
                  defaultValue={editingCustomer.Address}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Update Customer</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Loading customers...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredCustomers.map((customer) => (
            <Card key={customer.CustomerID} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {customer.FirstName} {customer.LastName}
                      </h3>
                      <Badge variant="outline">ID: {customer.CustomerID}</Badge>
                      <Badge variant="secondary">
                        {customer.VehicleCount} vehicle{customer.VehicleCount !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📞 {customer.PhoneNumber}</p>
                      <p>📍 {customer.Address}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditCustomer(customer)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteCustomer(customer)}
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

      {filteredCustomers.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No customers found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}