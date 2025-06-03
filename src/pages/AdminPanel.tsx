"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { departments } from "@/lib/utils";
import { Search, Pencil, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import userService from "@/services/user-service";
import useApi from "@/hooks/use-api";

export default function AdminPanel() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(
    null
  );

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
    manager: "",
    password: "",
  });

  // Fetch users with useApi hook
  const {
    data: users,
    isLoading,
    error,
    execute: fetchUsers,
  } = useApi(userService.getAllUsers);

  // Get managers from user list
  const managers = users
    ? users
        .filter((user) => user.roles.includes("manager"))
        .map((manager) => ({
          id: manager.id,
          name: `${manager.firstName || ""} ${manager.lastName || ""}`.trim(),
        }))
    : [];

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open edit dialog and set form data
  const handleEditEmployee = (employeeId: number) => {
    const employee = users?.find((emp) => emp.id === employeeId);
    if (employee) {
      setFormData({
        name: `${employee.firstName || ""} ${employee.lastName || ""}`.trim(),
        email: employee.email || "",
        department: employee.department || "",
        role:
          employee.roles
            .find((role) => role.startsWith("ROLE_"))
            ?.replace("ROLE_", "") || "",
        manager: employee.managerId ? employee.managerId.toString() : "",
        password: "", // Password is not editable, can be left empty
      });
      setEditingEmployeeId(employeeId);
      setIsEditDialogOpen(true);
    }
  };

  // Handle edit form submission
  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!editingEmployeeId) {
      toast({
        title: "Error",
        description: "Employee ID is missing",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Parse name into first and last name
      const nameParts = formData.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Prepare role
      const role = formData.role ? formData.role.toLowerCase() : "";

      await userService.updateUser(editingEmployeeId, {
        firstName,
        lastName,
        email: formData.email,
        roles: [role],
        ...(formData.department && { department: formData.department }),
        ...(formData.manager && { managerId: parseInt(formData.manager) }),
      });

      // Show success message
      toast({
        title: "Employee updated",
        description: `${formData.name}'s information has been updated.`,
      });

      // Refresh user list
      fetchUsers();

      // Close dialog
      setIsEditDialogOpen(false);
      setEditingEmployeeId(null);
    } catch (error) {
      // Show error message
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "There was a problem updating the employee.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission for new employee
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {

       // Parse name into first and last name
      const nameParts = formData.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Prepare role
      const role = formData.role ? formData.role.toLowerCase() : "";

      await userService.createUser({
        firstName,
        lastName,
        email: formData.email,
        username: formData.name,
        roles: [role],
        password: formData.password,
        ...(formData.department && { department: formData.department }),
        ...(formData.manager && { managerId: parseInt(formData.manager) }),
      });

      console.log("Creating user...", {
        firstName,
        lastName,
        email: formData.email,
        username: formData.name,
        roles: [role],
        password: formData.password,
        ...(formData.department && { department: formData.department }),
        ...(formData.manager && { managerId: parseInt(formData.manager) }),
      })
      
      // Show success message
      toast({
        title: "Employee created",
        description: `${formData.name} has been added to the system.`,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        department: "",
        role: "",
        manager: "",
        password: "",
      });

      // Refresh user list
      fetchUsers();
    } catch (error) {
      // Show error message
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "There was a problem creating the employee.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter employees by search query
  const filteredUsers = users
    ? users.filter(
        (user) =>
          `${user.firstName || ""} ${user.lastName || ""}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (user.email || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (user.department || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : [];

  // Convert role from ROLE_XXX format to display format
  const formatRole = (role: string) => {
    if (!role) return "";
    return (
      role.replace("ROLE_", "").charAt(0) +
      role.replace("ROLE_", "").slice(1).toLowerCase()
    );
  };

  // Get manager name by ID
  const getManagerName = (managerId?: number) => {
    if (!managerId) return "N/A";
    const manager = users?.find((user) => user.id === managerId);
    return manager
      ? `${manager.firstName || ""} ${manager.lastName || ""}`.trim()
      : "N/A";
  };

  // Show loading state
  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  // Show error state
  if (error) {
    return (
      <AppShell>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message || "Failed to load user data. Please try again."}
          </AlertDescription>
        </Alert>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage employees and system settings
          </p>
        </div>

        <Tabs defaultValue="employees">
          <TabsList>
            <TabsTrigger value="employees">Employee Management</TabsTrigger>
            <TabsTrigger value="create">Create Employee</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="mt-6">
            <div className="flex w-full items-center space-x-2 max-w-sm mb-6">
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
              />
              <Button type="submit" size="icon" className="h-9 w-9">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Employees</CardTitle>
                <CardDescription>
                  Manage all employees in the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Manager</TableHead>
                        <TableHead className="w-[60px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{`${user.firstName || ""} ${user.lastName || ""}`}</TableCell>
                          <TableCell>{user.email || "N/A"}</TableCell>
                          <TableCell>{user.department || "N/A"}</TableCell>
                          <TableCell>
                            {user.roles
                              .map((role) => formatRole(role))
                              .join(", ")}
                          </TableCell>
                          <TableCell>
                            {getManagerName(user.managerId)}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditEmployee(user.id as number)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <Card>
              <form>
                <CardHeader>
                  <CardTitle>Create Employee</CardTitle>
                  <CardDescription>
                    Add a new employee to the system.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) =>
                          handleSelectChange("department", value)
                        }
                        required
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) =>
                          handleSelectChange("role", value)
                        }
                        required
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Employee">Employee</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Finance Manager">
                            Finance Manager
                          </SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="manager">Assign Manager</Label>
                      <Select
                        value={formData.manager}
                        onValueChange={(value) =>
                          handleSelectChange("manager", value)
                        }
                      >
                        <SelectTrigger id="manager">
                          <SelectValue placeholder="Select manager (if applicable)" />
                        </SelectTrigger>
                        <SelectContent>
                          {managers.map((manager) => (
                            <SelectItem
                              key={manager.id}
                              value={manager.id?.toString() as string}
                            >
                              {manager.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        name: "",
                        email: "",
                        department: "",
                        role: "",
                        manager: "",
                        password: "",
                      })
                    }
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} onClick={handleCreateEmployee}>
                    {isSubmitting ? 
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                     : "Create Employee"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure global system settings and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center py-12">
                  Settings panel would be implemented here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Employee Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <form onSubmit={handleUpdateEmployee}>
              <DialogHeader>
                <DialogTitle>Edit Employee</DialogTitle>
                <DialogDescription>
                  Update employee information. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      handleSelectChange("department", value)
                    }
                    required
                  >
                    <SelectTrigger id="edit-department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleSelectChange("role", value)}
                    required
                  >
                    <SelectTrigger id="edit-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Employee">Employee</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Finance Manager">
                        Finance Manager
                      </SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-manager">Assign Manager</Label>
                  <Select
                    value={formData.manager}
                    onValueChange={(value) =>
                      handleSelectChange("manager", value)
                    }
                  >
                    <SelectTrigger id="edit-manager">
                      <SelectValue placeholder="Select manager (if applicable)" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers.map((manager) => (
                        <SelectItem
                          key={manager.id}
                          value={manager.id?.toString() as string}
                        >
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
