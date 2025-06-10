import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, UserCheck, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from "@/api/api";

interface Employee {
  EmployeeID: number;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Salary: number;
  JobTitle: string;
  BirthDate: string;
  Status?: string;
  CurrentShift?: string;
}

export function EmployeeManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch employees.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch =
      `${employee.FirstName} ${employee.LastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.JobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.PhoneNumber.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || employee.Status?.toLowerCase().replace(" ", "") === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleAddEmployee = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newEmployee = {
      FirstName: formData.get('FirstName') as string,
      LastName: formData.get('LastName') as string,
      PhoneNumber: formData.get('PhoneNumber') as string,
      Salary: parseFloat(formData.get('Salary') as string),
      JobTitle: formData.get('JobTitle') as string,
      BirthDate: formData.get('BirthDate') as string,
    };
    try {
      const addedEmployee = await addEmployee(newEmployee);
      setEmployees([...employees, { ...addedEmployee, Status: 'Active', CurrentShift: 'Day Shift' }]);
      setIsAddDialogOpen(false);
      toast({
        title: "Employee Added",
        description: `${newEmployee.FirstName} ${newEmployee.LastName} has been added.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add employee.",
        variant: "destructive",
      });
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleUpdateEmployee = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingEmployee) return;
    const formData = new FormData(event.currentTarget);
    const updatedEmployee = {
      FirstName: formData.get('FirstName') as string,
      LastName: formData.get('LastName') as string,
      PhoneNumber: formData.get('PhoneNumber') as string,
      Salary: parseFloat(formData.get('Salary') as string),
      JobTitle: formData.get('JobTitle') as string,
      BirthDate: formData.get('BirthDate') as string,
    };
    try {
      await updateEmployee(editingEmployee.EmployeeID, updatedEmployee);
      setEmployees(employees.map(e =>
        e.EmployeeID === editingEmployee.EmployeeID ? { ...e, ...updatedEmployee } : e
      ));
      setIsEditDialogOpen(false);
      setEditingEmployee(null);
      toast({
        title: "Employee Updated",
        description: `${updatedEmployee.FirstName} ${updatedEmployee.LastName} has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.FirstName} ${employee.LastName}?`)) {
      try {
        await deleteEmployee(employee.EmployeeID);
        setEmployees(employees.filter(e => e.EmployeeID !== employee.EmployeeID));
        toast({
          title: "Employee Deleted",
          description: `${employee.FirstName} ${employee.LastName} has been deleted.`,
          variant: "destructive",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete employee.",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusColor = (status?: string) => {
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
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="FirstName">First Name</Label>
                  <Input id="FirstName" name="FirstName" placeholder="Sarah" required />
                </div>
                <div>
                  <Label htmlFor="LastName">Last Name</Label>
                  <Input id="LastName" name="LastName" placeholder="Wilson" required />
                </div>
              </div>
              <div>
                <Label htmlFor="PhoneNumber">Phone Number</Label>
                <Input id="PhoneNumber" name="PhoneNumber" placeholder="555-0111" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="Salary">Salary ($)</Label>
                  <Input id="Salary" name="Salary" placeholder="45000" type="number" required />
                </div>
                <div>
                  <Label htmlFor="JobTitle">Job Title</Label>
                  <Select name="JobTitle" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Parking Attendant">Parking Attendant</SelectItem>
                      <SelectItem value="Security Guard">Security Guard</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="BirthDate">Birth Date</Label>
                <Input id="BirthDate" name="BirthDate" type="date" required />
              </div>
              <Button type="submit" className="w-full">Add Employee</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {editingEmployee && (
            <form onSubmit={handleUpdateEmployee} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input
                    id="editFirstName"
                    name="FirstName"
                    defaultValue={editingEmployee.FirstName}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input
                    id="editLastName"
                    name="LastName"
                    defaultValue={editingEmployee.LastName}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editPhoneNumber">Phone Number</Label>
                <Input
                  id="editPhoneNumber"
                  name="PhoneNumber"
                  defaultValue={editingEmployee.PhoneNumber}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editSalary">Salary ($)</Label>
                  <Input
                    id="editSalary"
                    name="Salary"
                    defaultValue={editingEmployee.Salary}
                    type="number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editJobTitle">Job Title</Label>
                  <Select name="JobTitle" defaultValue={editingEmployee.JobTitle} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Parking Attendant">Parking Attendant</SelectItem>
                      <SelectItem value="Security Guard">Security Guard</SelectItem>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="editBirthDate">Birth Date</Label>
                <Input
                  id="editBirthDate"
                  name="BirthDate"
                  defaultValue={editingEmployee.BirthDate}
                  type="date"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Update Employee</Button>
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

      {loading ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Loading employees...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredEmployees.map((employee) => (
            <Card key={employee.EmployeeID} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <UserCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {employee.FirstName} {employee.LastName}
                        </h3>
                        <Badge variant="outline">ID: {employee.EmployeeID}</Badge>
                        {employee.Status && (
                          <Badge className={getStatusColor(employee.Status)}>{employee.Status}</Badge>
                        )}
                        <Badge className={getJobTitleColor(employee.JobTitle)}>{employee.JobTitle}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <p>📞 {employee.PhoneNumber}</p>
                        <p>💰 ${employee.Salary.toLocaleString()}/year</p>
                        <p>🎂 {new Date(employee.BirthDate).toLocaleDateString()}</p>
                      </div>
                      {employee.CurrentShift && (
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">{employee.CurrentShift}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditEmployee(employee)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteEmployee(employee)}
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

      {filteredEmployees.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No employees found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

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
              {employees.filter(e => e.Status === 'Active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">On Break</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {employees.filter(e => e.Status === 'On Break').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${employees
  .reduce((sum, emp) => sum + (typeof emp.Salary === "number" && !isNaN(emp.Salary) ? emp.Salary : 0), 0)
  .toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}