
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Clock, Car, Ticket } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ParkingTicket {
  ticketID: number;
  licensePlate: string;
  issuedTime: string;
  expiredTime: string;
  serviceID: number;
  serviceName: string;
  status: 'Active' | 'Expired' | 'Used';
  customerName: string;
}

export function TicketManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data
  const [tickets] = useState<ParkingTicket[]>([
    { 
      ticketID: 1, 
      licensePlate: "ABC-123", 
      issuedTime: "2024-05-26 08:00:00", 
      expiredTime: "2024-05-26 18:00:00", 
      serviceID: 2, 
      serviceName: "Daily Parking", 
      status: "Active",
      customerName: "John Doe"
    },
    { 
      ticketID: 2, 
      licensePlate: "XYZ-789", 
      issuedTime: "2024-05-26 09:30:00", 
      expiredTime: "2024-05-26 17:30:00", 
      serviceID: 3, 
      serviceName: "Motorcycle Parking", 
      status: "Active",
      customerName: "Jane Smith"
    },
    { 
      ticketID: 3, 
      licensePlate: "DEF-456", 
      issuedTime: "2024-05-25 14:00:00", 
      expiredTime: "2024-05-25 22:00:00", 
      serviceID: 6, 
      serviceName: "Overnight Parking", 
      status: "Expired",
      customerName: "Mike Johnson"
    },
    { 
      ticketID: 4, 
      licensePlate: "GHI-321", 
      issuedTime: "2024-05-26 10:15:00", 
      expiredTime: "2024-05-26 16:15:00", 
      serviceID: 2, 
      serviceName: "Daily Parking", 
      status: "Used",
      customerName: "Sarah Wilson"
    },
    { 
      ticketID: 5, 
      licensePlate: "JKL-654", 
      issuedTime: "2024-05-26 07:45:00", 
      expiredTime: "2024-06-26 07:45:00", 
      serviceID: 1, 
      serviceName: "Monthly Parking", 
      status: "Active",
      customerName: "David Chen"
    },
  ]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
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
    active: tickets.filter(t => t.status === 'Active').length,
    expired: tickets.filter(t => t.status === 'Expired').length,
    used: tickets.filter(t => t.status === 'Used').length,
    expiringSoon: tickets.filter(t => t.status === 'Active' && isExpiringSoon(t.expiredTime)).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Ticket Management</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Issue New Ticket
        </Button>
      </div>

      {/* Stats */}
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

      {/* Search and Filter */}
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

      {/* Ticket List */}
      <div className="grid gap-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.ticketID} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Ticket className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">Ticket #{ticket.ticketID}</h3>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                      {ticket.status === 'Active' && isExpiringSoon(ticket.expiredTime) && (
                        <Badge className="bg-orange-100 text-orange-800">
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-600" />
                        <span><strong>Vehicle:</strong> {ticket.licensePlate}</span>
                      </div>
                      <div>
                        <span><strong>Customer:</strong> {ticket.customerName}</span>
                      </div>
                      <div>
                        <span><strong>Service:</strong> {ticket.serviceName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span><strong>Issued:</strong> {formatDateTime(ticket.issuedTime)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm">
                      <span className={`font-medium ${ticket.status === 'Expired' ? 'text-red-600' : 'text-gray-600'}`}>
                        <strong>Expires:</strong> {formatDateTime(ticket.expiredTime)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {ticket.status === 'Active' && (
                    <>
                      <Button variant="outline" size="sm">
                        Extend
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Void
                      </Button>
                    </>
                  )}
                  {ticket.status === 'Expired' && (
                    <Button variant="outline" size="sm">
                      Renew
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No tickets found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
