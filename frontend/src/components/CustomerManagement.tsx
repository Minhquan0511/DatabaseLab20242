
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  customerID: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  vehicleCount: number;
}

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  // Mock data - in real app this would come from your database
  const [customers, setCustomers] = useState<Customer[]>([
    { customerID: 1, firstName: "John", lastName: "Doe", phoneNumber: "555-0123", address: "123 Main St", vehicleCount: 2 },
    { customerID: 2, firstName: "Jane", lastName: "Smith", phoneNumber: "555-0456", address: "456 Oak Ave", vehicleCount: 1 },
    { customerID: 3, firstName: "Mike", lastName: "Johnson", phoneNumber: "555-0789", address: "789 Pine Rd", vehicleCount: 3 },
  ]);

  const filteredCustomers = customers.filter(customer =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phoneNumber.includes(searchTerm)
  );

  const handleAddCustomer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newCustomer: Customer = {
      customerID: Math.max(...customers.map(c => c.customerID)) + 1,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phoneNumber: formData.get('phone') as string,
      address: formData.get('address') as string,
      vehicleCount: 0,
    };
    setCustomers([...customers, newCustomer]);
    setIsAddDialogOpen(false);
    toast({
      title: "Customer Added",
      description: `${newCustomer.firstName} ${newCustomer.lastName} has been added successfully.`,
    });
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCustomer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingCustomer) return;
    
    const formData = new FormData(event.currentTarget);
    const updatedCustomer: Customer = {
      ...editingCustomer,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phoneNumber: formData.get('phone') as string,
      address: formData.get('address') as string,
    };
    
    setCustomers(customers.map(c => 
      c.customerID === editingCustomer.customerID ? updatedCustomer : c
    ));
    setIsEditDialogOpen(false);
    setEditingCustomer(null);
    toast({
      title: "Customer Updated",
      description: `${updatedCustomer.firstName} ${updatedCustomer.lastName} has been updated successfully.`,
    });
  };

  const handleDeleteCustomer = (customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`)) {
      setCustomers(customers.filter(c => c.customerID !== customer.customerID));
      toast({
        title: "Customer Deleted",
        description: `${customer.firstName} ${customer.lastName} has been deleted.`,
        variant: "destructive",
      });
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
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="John" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Doe" required />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" placeholder="555-0123" required />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" placeholder="123 Main St" required />
              </div>
              <Button type="submit" className="w-full">
                Add Customer
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
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
                    name="firstName" 
                    defaultValue={editingCustomer.firstName}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input 
                    id="editLastName" 
                    name="lastName" 
                    defaultValue={editingCustomer.lastName}
                    required 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editPhone">Phone Number</Label>
                <Input 
                  id="editPhone" 
                  name="phone" 
                  defaultValue={editingCustomer.phoneNumber}
                  required 
                />
              </div>
              <div>
                <Label htmlFor="editAddress">Address</Label>
                <Input 
                  id="editAddress" 
                  name="address" 
                  defaultValue={editingCustomer.address}
                  required 
                />
              </div>
              <Button type="submit" className="w-full">
                Update Customer
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Search */}
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

      {/* Customer List */}
      <div className="grid gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.customerID} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <Badge variant="outline">
                      ID: {customer.customerID}
                    </Badge>
                    <Badge variant="secondary">
                      {customer.vehicleCount} vehicle{customer.vehicleCount !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📞 {customer.phoneNumber}</p>
                    <p>📍 {customer.address}</p>
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

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No customers found matching your search.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
