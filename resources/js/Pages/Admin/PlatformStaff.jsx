import React, { useState, useMemo, useEffect, useCallback } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

export default function PlatformStaff({ initialStaff = [], success = null, error = null }) {
    const [staff, setStaff] = useState(initialStaff || []);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [editedStaff, setEditedStaff] = useState(null);
    const [isStaffSelected, setIsStaffSelected] = useState(false);

    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditingGeneral, setIsEditingGeneral] = useState(false);
    const [isEditingAdditional, setIsEditingAdditional] = useState(false);

    const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);

    // Initialize with empty values
    const emptyStaff = {
        name: '',
        role: '',
        email: '',
        phone: '',
        avatar: null,
        department: '',
        office_location: '',
        date_hired: new Date().toISOString().split('T')[0],
        status: 'active'
    };

    const [newStaff, setNewStaff] = useState(emptyStaff);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterBy, setFilterBy] = useState("all");
    const [isLoading, setIsLoading] = useState(false);

    const [filterByRole, setFilterByRole] = useState("all");
    const [filterByStatus, setFilterByStatus] = useState("all");

    const roleOptions = [
        { value: "project_manager", label: "Project Manager" },
        { value: "lead_developer", label: "Lead Developer" },
        { value: "developer", label: "Developer" },
        { value: "qa", label: "Quality Assurance" },
        { value: "designer", label: "UI/UX Designer" },
        { value: "data_analyst", label: "Data Analyst" }
    ];

    const statusOptions = [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "on_leave", label: "On Leave" },
        { value: "suspended", label: "Suspended" }
    ];

    const handleAddNewStaff = async () => {
        try {
            const response = await axios.post(route('platform-staff.store'), newStaff);
            setStaff([...staff, response.data]);
            setIsNewStaffModalOpen(false);
            // Reset form
            setNewStaff(emptyStaff);
        } catch (error) {
            console.error('Error adding staff:', error);
        }
    };

    const handleInputChange = (e) => {
        setEditedStaff({ ...editedStaff, [e.target.name]: e.target.value });
    };

    const handleSaveGeneral = async () => {
        try {
            const response = await axios.put(
                route('platform-staff.update', selectedStaff.id), 
                editedStaff
            );
            setStaff(staff.map(s => s.id === selectedStaff.id ? response.data : s));
            setSelectedStaff(response.data);
            setIsEditingGeneral(false);
        } catch (error) {
            console.error('Error updating staff:', error);
        }
    };

    const handleCancelGeneral = () => {
        setEditedStaff({ ...selectedStaff });
        setIsEditingGeneral(false);
    };

    const handleSaveAdditional = () => {
        setSelectedStaff(editedStaff);
        setStaff(staff.map(s => s.id === editedStaff.id ? editedStaff : s));
        setIsEditingAdditional(false);
    };

    const handleCancelAdditional = () => {
        setEditedStaff({ ...selectedStaff });
        setIsEditingAdditional(false);
    };

    const startEditingGeneral = () => {
        setEditedStaff({ ...selectedStaff });
        setIsEditingGeneral(true);
    };

    const startEditingAdditional = () => {
        setEditedStaff({ ...selectedStaff });
        setIsEditingAdditional(true);
    };

    const handleProfilePictureChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewProfilePicture(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleProfilePictureUpload = async () => {
        const formData = new FormData();
        formData.append('avatar', document.getElementById('picture').files[0]);

        try {
            const response = await axios.post(
                route('platform-staff.avatar', selectedStaff.id),
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            setStaff(staff.map(s => 
                s.id === selectedStaff.id 
                    ? {...s, avatar: response.data.avatar} 
                    : s
            ));
            setSelectedStaff({...selectedStaff, avatar: response.data.avatar});
            setNewProfilePicture(null);
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    };

    const filteredStaff = useMemo(() => {
        setIsLoading(true);
        try {
            return staff.filter((member) => {
                const searchLower = searchQuery.toLowerCase();
                const matchesSearch = 
                    !searchQuery || 
                    member.name.toLowerCase().includes(searchLower) ||
                    member.role.toLowerCase().includes(searchLower) ||
                    member.department.toLowerCase().includes(searchLower);

                const matchesRole = 
                    filterByRole === "all" || 
                    member.role === filterByRole;

                const matchesStatus = 
                    filterByStatus === "all" || 
                    member.status === filterByStatus;

                return matchesSearch && matchesRole && matchesStatus;
            });
        } finally {
            setIsLoading(false);
        }
    }, [staff, searchQuery, filterByRole, filterByStatus]);

    useEffect(() => {
        if (selectedStaff) {
            setEditedStaff({
                ...selectedStaff,
                dateHired: selectedStaff.date_hired || new Date().toISOString().split('T')[0],
                status: selectedStaff.status || "active",
                officeLocation: selectedStaff.office_location || "N/A",
                department: selectedStaff.department || "N/A"
            });
        }
    }, [selectedStaff]);

    useEffect(() => {
        // Show success message if any
        if (success) {
            // Add your success notification here
            console.log('Success:', success);
        }
        // Show error message if any
        if (error) {
            // Add your error notification here
            console.error('Error:', error);
        }
    }, [success, error]);

    const handleStaffSelect = useCallback((member) => {
        if (member) {
            setSelectedStaff(member);
            setIsStaffSelected(true);
            setIsEditingGeneral(false);
            setIsEditingAdditional(false);
        }
    }, []);

    return (
        <AdminLayout>
            <Head title="Platform Staff" />
            
            {/* Page Header */}
            <div className="border-b">
                <div className="container mx-auto px-6 py-4">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Platform Staff</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Manage and oversee platform staff members
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8 space-y-6">
                {/* Staff List */}
                <Card>
                    <CardHeader className="border-b space-y-4 pb-4">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">Staff List</CardTitle>
                            <Button 
                                onClick={() => setIsNewStaffModalOpen(true)}
                                variant="default"
                                size="sm"
                                className="w-28"
                            >
                                Add Staff
                            </Button>
                        </div>
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                            <Input
                                placeholder="Search by name, role, or department..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1"
                            />
                            <div className="flex gap-2">
                                <Select value={filterByRole} onValueChange={setFilterByRole}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Filter by Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="Project Manager">Project Manager</SelectItem>
                                        <SelectItem value="Lead Developer">Lead Developer</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={filterByStatus} onValueChange={setFilterByStatus}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-olive-600" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-2">
                                {staff.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No staff members found. Add your first staff member.
                                    </div>
                                ) : (
                                    filteredStaff.map((member) => (
                                        <div 
                                            key={member.id} 
                                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                                                selectedStaff?.id === member.id 
                                                    ? 'bg-olive-50 border-olive-600 dark:bg-olive-900/30 dark:border-olive-500' 
                                                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                            }`}
                                            onClick={() => handleStaffSelect(member)}
                                        >
                                            <Avatar className="h-12 w-12 border border-gray-200 dark:border-gray-700">
                                                <AvatarImage src={member.avatar} alt={member.name} />
                                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate dark:text-gray-100">{member.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{member.role}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                        member.status === 'Active' 
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                        {member.status}
                                                    </span>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500">{member.department}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Staff Details Section - Only show when staff is selected */}
                {selectedStaff && isStaffSelected && (
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <Card>
                            <CardContent className="flex items-center gap-6 p-6">
                                <Avatar className="w-24 h-24 border-4 border-olive-600/10">
                                    <AvatarImage 
                                        src={selectedStaff.avatar || '/default-avatar.png'} 
                                        alt={selectedStaff.name} 
                                    />
                                    <AvatarFallback>{selectedStaff.name ? selectedStaff.name.charAt(0) : '?'}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-semibold dark:text-gray-100">{selectedStaff.name}</h2>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1">{selectedStaff.role}</p>
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setIsDialogOpen(true)}
                                        className="mt-4"
                                        size="sm"
                                    >
                                        Change Photo
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* General Information Card */}
                        <Card className="dark:border-gray-700">
                            <CardHeader className="border-b dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl dark:text-gray-100">General Information</CardTitle>
                                    {isEditingGeneral ? (
                                        <div className="flex gap-2">
                                            <Button onClick={handleSaveGeneral} variant="default">
                                                Save Changes
                                            </Button>
                                            <Button onClick={handleCancelGeneral} variant="outline">
                                                Cancel
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button onClick={startEditingGeneral} variant="outline">
                                            Edit Details
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={isEditingGeneral ? editedStaff.name : selectedStaff.name}
                                            onChange={handleInputChange}
                                            disabled={!isEditingGeneral}

                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="role">Role</Label>
                                        {isEditingGeneral ? (
                                            <Select 
                                                value={editedStaff.role}
                                                onValueChange={(value) => setEditedStaff({ ...editedStaff, role: value })}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roleOptions.map((role) => (
                                                        <SelectItem key={role.value} value={role.value}>
                                                            {role.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Input
                                                value={selectedStaff.role}
                                                disabled
                                                className="bg-gray-50"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            value={isEditingGeneral ? editedStaff.email : selectedStaff.email}
                                            onChange={handleInputChange}
                                            disabled={!isEditingGeneral}
  
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={isEditingGeneral ? editedStaff.phone : selectedStaff.phone}
                                            onChange={handleInputChange}
                                            disabled={!isEditingGeneral}

                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Information Card */}
                        <Card className="dark:border-gray-700">
                            <CardHeader className="border-b dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl dark:text-gray-100">Additional Information</CardTitle>
                                    {isEditingAdditional ? (
                                        <div className="flex gap-2">
                                            <Button onClick={handleSaveAdditional} variant="default">
                                                Save Changes
                                            </Button>
                                            <Button onClick={handleCancelAdditional} variant="outline">
                                                Cancel
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button onClick={startEditingAdditional} variant="outline">
                                            Edit Details
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="department">Department</Label>
                                        <Input
                                            id="department"
                                            name="department"
                                            value={isEditingAdditional ? editedStaff.department : selectedStaff.department}
                                            onChange={handleInputChange}
                                            disabled={!isEditingAdditional}

                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="officeLocation">Office Location</Label>
                                        <Input
                                            id="officeLocation"
                                            name="officeLocation"
                                            value={isEditingAdditional ? editedStaff.officeLocation : selectedStaff.officeLocation}
                                            onChange={handleInputChange}
                                            disabled={!isEditingAdditional}

                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="dateHired">Date Hired</Label>
                                        <Input
                                            id="dateHired"
                                            name="dateHired"
                                            type="date"
                                            value={isEditingAdditional ? editedStaff.dateHired : selectedStaff.dateHired}
                                            onChange={handleInputChange}
                                            disabled={!isEditingAdditional}

                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        {isEditingAdditional ? (
                                            <Select 
                                                value={editedStaff.status}
                                                onValueChange={(value) => setEditedStaff({ ...editedStaff, status: value })}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statusOptions.map((status) => (
                                                        <SelectItem key={status.value} value={status.value}>
                                                            {status.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <Input
                                                value={selectedStaff.status}
                                                disabled
                                                className="bg-gray-50"
                                            />
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Add Staff Modal */}
                <Dialog open={isNewStaffModalOpen} onOpenChange={setIsNewStaffModalOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Staff</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="newName">Name</Label>
                                <Input
                                    id="newName"
                                    value={newStaff.name}
                                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="newRole">Role</Label>
                                <Select 
                                    value={newStaff.role}
                                    onValueChange={(value) => setNewStaff({...newStaff, role: value})}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roleOptions.map((role) => (
                                            <SelectItem key={role.value} value={role.value}>
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="newEmail">Email</Label>
                                <Input
                                    id="newEmail"
                                    type="email"
                                    value={newStaff.email}
                                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="newPhone">Phone</Label>
                                <Input
                                    id="newPhone"
                                    value={newStaff.phone}
                                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsNewStaffModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="default" onClick={handleAddNewStaff}>
                                Add Staff
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Change Photo Modal */}
                <Dialog open={isDialogOpen && selectedStaff !== null} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Update Profile Picture</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <Avatar className="w-40 h-40">
                                        <AvatarImage 
                                            src={newProfilePicture || (selectedStaff?.avatar || '/default-avatar.png')}
                                            alt={selectedStaff?.name || 'Profile'}
                                        />
                                        <AvatarFallback>
                                            {selectedStaff?.name ? selectedStaff.name.charAt(0) : '?'}
                                        </AvatarFallback>
                                    </Avatar>
                                    {newProfilePicture && (
                                        <div className="absolute -bottom-2 left-0 w-full text-center">
                                            <span className="bg-olive-600 text-white text-xs px-2 py-1 rounded-full">
                                                Preview
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <Input
                                    id="picture"
                                    type="file"
                                    onChange={handleProfilePictureChange}
                                    accept="image/*"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setNewProfilePicture(null);
                                    setIsDialogOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                onClick={handleProfilePictureUpload}
                                disabled={!newProfilePicture}
                            >
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}