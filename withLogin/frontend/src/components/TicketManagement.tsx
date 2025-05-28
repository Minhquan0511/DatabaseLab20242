import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Search, Clock, Car, Ticket } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getTickets, addTicket, updateTicket, getCustomers, getVehicles, getServices } from "@/api/api";

interface Ticket {
  TicketID: number;
  LicensePlate: string;
  IssuedTime: string;
  ExpiredTime: string;
  ServiceID: number;
  ServiceName?: string;
  Status?: string;
  CustomerName?: string;
}

interface Customer {
  CustomerID: number;
  FirstName: string;
  LastName: string;
}

interface Vehicle {
  LicensePlate: string;
  CustomerID: number;
}

interface Service {
  ServiceID: number;
  ServiceName: string;
}

export function TicketManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ticketData, customerData, vehicleData, serviceData] = await Promise.all([
          getTickets(),
          getCustomers(),
          getVehicles(),
          getServices(),
        ]);
        const enrichedTickets = ticketData.map(ticket => {
          const vehicle = vehicleData.find(v => v.LicensePlate === ticket.LicensePlate);
          const customer = customerData.find(c => c.CustomerID === vehicle?.CustomerID);
          const service = serviceData.find(s => s.ServiceID === ticket.ServiceID);
          return {
            ...ticket,
            CustomerName: customer ? `${customer.FirstName} ${customer.LastName}` : 'Unknown',
            ServiceName: service?.ServiceName || 'Unknown',
            Status: ticket.ExpiredTime < new Date().toISOString() ? 'Expired' : 'Active',
          };
        });
        setTickets(enrichedTickets);
        setCustomers(customerData);
        setVehicles(vehicleData);
        setServices(serviceData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch tickets.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExtendTicket = async (ticketId: number) => {
    try {
      const ticket = tickets.find(t => t.TicketID === ticketId);
      if (!ticket) return;
      const updatedTicket = {
        ExpiredTime: new Date(new Date(ticket.ExpiredTime).getTime() + 2 * 3600000).toISOString(),
      };
      await updateTicket(ticketId, updatedTicket);
      setTickets(tickets.map(t =>
        t.TicketID === ticketId ? { ...t, ...updatedTicket, Status: 'Active' } : t
      ));
      toast({
        title: "Ticket Extended",
        description: `Ticket #${ticketId} has been extended by 2 hours.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extend ticket.",
        variant: "destructive",
      });
    }
  };

  const handleVoidTicket = async (ticketId: number) => {
    try {
      const updatedTicket = { Status: 'Used' };
      await updateTicket(ticketId, updatedTicket);
      setTickets(tickets.map(t =>
        t.TicketID === ticketId ? { ...t, ...updatedTicket } : t
      ));
      toast({
        title: "Ticket Voided",
        description: `Ticket #${ticketId} has been voided.`,
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to void ticket.",
        variant: "destructive",
      });
    }
  };

  const handleRenewTicket = async (ticketId: number) => {
    try {
      const updatedTicket = {
        Status: 'Active',
        IssuedTime: new Date().toISOString(),
        ExpiredTime: new Date(Date.now() + 8 * 3600000).toISOString(),
      };
      await updateTicket(ticketId, updatedTicket);
      setTickets(tickets.map(t =>
        t.TicketID === ticketId ? { ...t, ...updatedTicket } : t
      ));
      toast({
        title: "Ticket Renewed",
        description: `Ticket #${ticketId} has been renewed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to renew ticket.",
        variant: "destructive",
      });
    }
  };

  const handleIssueNewTicket = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTicket = {
      LicensePlate: formData.get('LicensePlate') as string,
      ServiceID: parseInt(formData.get('ServiceID') as string),
      IssuedTime: new Date().toISOString(),
      ExpiredTime: new Date(Date.now() + 8 * 3600000).toISOString(),
    };
    try {
      const addedTicket = await addTicket(newTicket);
      const vehicle = vehicles.find(v => v.LicensePlate === addedTicket.LicensePlate);
      const customer = customers.find(c => c.CustomerID === vehicle?.CustomerID);
      const service = services.find(s => s.ServiceID === addedTicket.ServiceID);
      setTickets([
        ...tickets,
        {
          ...addedTicket,
          CustomerName: customer ? `${customer.FirstName} ${customer.LastName}` : 'Unknown',
          ServiceName: service?.ServiceName || 'Unknown',
          Status: 'Active',
        },
      ]);
      setIsAddDialogOpen(false);
      toast({
        title: "Ticket Issued",
        description: `Ticket #${addedTicket.TicketID} has been issued.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to issue ticket.",
        variant: "destructive",
      });
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket.LicensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (ticket.ServiceName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesStatus = filterStatus === "all" || ticket.Status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Used': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (expiredTime: string) => {
    const now = new Date();
    const expiry = new Date(expiredTime);
    const diffHours = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours <= 2 && diffHours > 0;
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const stats = {
    total: tickets.length,
    active: tickets.filter(t => t.Status === 'Active').length,
    expired: tickets.filter(t => t.Status === 'Expired').length,
    used: tickets.filter(t => t.Status === 'Used').length,
    expiringSoon: tickets.filter(t => t.Status === 'Active' && isExpiringSoon(t.ExpiredTime)).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Ticket Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Issue New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Issue New Ticket</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleIssueNewTicket} className="space-y-4">
              <div>
                <Label htmlFor="LicensePlate">License Plate</Label>
                <Select name="LicensePlate" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map(vehicle => (
                      <SelectItem key={vehicle.LicensePlate} value={vehicle.LicensePlate}>
                        {vehicle.LicensePlate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ServiceID">Service</Label>
                <Select name="ServiceID" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.ServiceID} value={service.ServiceID.toString()}>
                        {service.ServiceName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Issue Ticket</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <p className="text-sm text-gray-600">Total Tickets</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
              <p className="text-sm text-gray-600">Expired</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.used}</div>
              <p className="text-sm text-gray-600">Used</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by license plate, customer, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="used">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Loading tickets...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.TicketID} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Ticket className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">Ticket #{ticket.TicketID}</h3>
                        <Badge className={getStatusColor(ticket.Status)}>{ticket.Status}</Badge>
                        {ticket.Status === 'Active' && isExpiringSoon(ticket.ExpiredTime) && (
                          <Badge className="bg-orange-100 text-orange-800">Expiring Soon</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-gray-600" />
                          <span><strong>Vehicle:</strong> {ticket.LicensePlate}</span>
                        </div>
                        <div>
                          <span><strong>Customer:</strong> {ticket.CustomerName}</span>
                        </div>
                        <div>
                          <span><strong>Service:</strong> {ticket.ServiceName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-600" />
                          <span><strong>Issued:</strong> {formatDateTime(ticket.IssuedTime)}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className={`font-medium ${ticket.Status === 'Expired' ? 'text-red-600' : 'text-gray-600'}`}>
                          <strong>Expires:</strong> {formatDateTime(ticket.ExpiredTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {ticket.Status === 'Active' && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleExtendTicket(ticket.TicketID)}>
                          Extend
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleVoidTicket(ticket.TicketID)}
                        >
                          Void
                        </Button>
                      </>
                    )}
                    {ticket.Status === 'Expired' && (
                      <Button variant="outline" size="sm" onClick={() => handleRenewTicket(ticket.TicketID)}>
                        Renew
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredTickets.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No tickets found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}