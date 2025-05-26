
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, UserCheck, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Employee {
  employeeID: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  salary: number;
  jobTitle: string;
  birthDate: string;
  status: 'Active' | 'On Break' | 'Off Duty';
  currentShift?: string;
}

export function EmployeeManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data
  const [employees] = useState<Employee[]>([
    { employeeID: 1, firstName: "Sarah", lastName: "Wilson", phoneNumber: "555-0111", salary: 45000, jobTitle: "Parking Attendant", birthDate: "1990-05-15", status: "Active", currentShift: "Morning Shift" },
    { employeeID: 2, firstName: "Mike", lastName: "Chen", phoneNumber: "555-0222", salary: 55000, jobTitle: "Security Guard", birthDate: "1988-12-03", status: "On Break", currentShift: "Day Shift" },
    { employeeID: 3, firstName: "Lisa", lastName: "Rodriguez", phoneNumber: "555-0333", salary: 65000, jobTitle: "Supervisor", birthDate: "1985-08-22", status: "Active", currentShift: "Day Shift" },
    { employeeID: 4, firstName: "David", lastName: "Thompson", phoneNumber: "555-0444", salary: 42000, jobTitle: "Parking Attendant", birthDate: "1992-11-08", status: "Off Duty" },
    { employeeID: 5, firstName: "Emily", lastName: "Davis", phoneNumber: "555-0555", salary: 48000, jobTitle: "Maintenance", birthDate: "1991-03-17", status: "Active", currentShift: "Evening Shift" },
  ]);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.phoneNumber.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || employee.status.toLowerCase().replace(" ", "") === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Break': return 'bg-yellow-100 text-yellow-800';
      case 'Off Duty': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobTitleColor = (title: string) => {
    switch (title) {
      case 'Supervisor': return 'bg-purple-100 text-purple-800';
      case 'Security Guard': return 'bg-red-100 text-red-800';
      case 'Parking Attendant': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="Sarah" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Wilson" />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="555-0111" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary">Salary ($)</Label>
                  <Input id="salary" placeholder="45000" type="number" />
                </div>
                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parking-attendant">Parking Attendant</SelectItem>
                      <SelectItem value="security-guard">Security Guard</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input id="birthDate" type="date" />
              </div>
              <Button className="w-full" onClick={() => setIsAddDialogOpen(false)}>
                Add Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees by name, job title, or phone..."
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
                <SelectItem value="onbreak">On Break</SelectItem>
                <SelectItem value="offduty">Off Duty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Grid */}
      <div className="grid gap-4">
        {filteredEmployees.map((employee) => (
          <Card key={employee.employeeID} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <UserCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <Badge variant="outline">
                        ID: {employee.employeeID}
                      </Badge>
                      <Badge className={getStatusColor(employee.status)}>
                        {employee.status}
                      </Badge>
                      <Badge className={getJobTitleColor(employee.jobTitle)}>
                        {employee.jobTitle}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <p>📞 {employee.phoneNumber}</p>
                      <p>💰 ${employee.salary.toLocaleString()}/year</p>
                      <p>🎂 {new Date(employee.birthDate).toLocaleDateString()}</p>
                    </div>
                    {employee.currentShift && (
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600">{employee.currentShift}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
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

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No employees found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Currently Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {employees.filter(e => e.status === 'Active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">On Break</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {employees.filter(e => e.status === 'On Break').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${employees.reduce((sum, emp) => sum + emp.salary, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
