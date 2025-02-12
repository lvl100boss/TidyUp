import React, { useState, useMemo } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
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

export default function PlatformStaff() {
    const [staff, setStaff] = useState([
        { 
            id: 1, 
            name: "Dave Jamir Basa", 
            role: "Project Manager", 
            avatar: "/path/to/dave-avatar.jpg",
            email: "dave.basa@example.com",
            phone: "+1234567890",
            externalLink: "www.facebook.com/davejamirbasa",
            dateHired: "2021-08-01",
            status: "Active",
            officeLocation: "Main Office",
            department: "Management"
        },
        { 
            id: 2, 
            name: "Carl Mosses Ramos", 
            role: "Quality Assurance", 
            avatar: "/path/to/carl-avatar.jpg",
            email: "carl.ramos@example.com",
            phone: "+1234567891",
            externalLink: "www.facebook.com/carlmossesramos",
            dateHired: "2021-08-02",
            status: "Active",
            officeLocation: "Main Office",
            department: "Quality Assurance"
        },
        { 
            id: 3, 
            name: "Paul Daniel Ojales", 
            role: "Data Analyst", 
            avatar: "/path/to/paul-avatar.jpg",
            email: "paul.ojales@example.com",
            phone: "+1234567892",
            externalLink: "www.facebook.com/pauldanielojales",
            dateHired: "2021-08-03",
            status: "Active",
            officeLocation: "Main Office",
            department: "Data Analysis"
        },
        { 
            id: 4, 
            name: "Art Michael Cadiz", 
            role: "Lead Developer", 
            avatar: "/path/to/art-avatar.jpg",
            email: "art.cadiz@example.com",
            phone: "+1234567893",
            externalLink: "www.facebook.com/artmichaelcadiz",
            dateHired: "2021-08-04",
            status: "Active",
            officeLocation: "Main Office",
            department: "Development"
        },
        { 
            id: 5, 
            name: "Gioiel Guevarra", 
            role: "UI/UX Designer", 
            avatar: "/path/to/gioiel-avatar.jpg",
            email: "gioiel.guevarra@example.com",
            phone: "+1234567894",
            externalLink: "www.facebook.com/gioielguevarra",
            dateHired: "2021-08-05",
            status: "Active",
            officeLocation: "Main Office",
            department: "Design"
        },
    ]);

    const [selectedStaff, setSelectedStaff] = useState(staff[0]);
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditingGeneral, setIsEditingGeneral] = useState(false);
    const [isEditingAdditional, setIsEditingAdditional] = useState(false);
    const [editedStaff, setEditedStaff] = useState({
        ...staff[0],
        dateHired: staff[0]?.dateHired || "2021-08-01",
        status: staff[0]?.status || "Active",
        officeLocation: staff[0]?.officeLocation || "N/A",
        department: staff[0]?.department || "N/A"
    });

    const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
    const [newStaff, setNewStaff] = useState({
        name: '',
        role: '',
        email: '',
        phone: '',
        dateHired: new Date().toISOString().split('T')[0],
        status: 'Active',
        officeLocation: 'Main Office',
        department: '',
        avatar: '/path/to/default-avatar.jpg'
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [filterBy, setFilterBy] = useState("all");
    const [isLoading, setIsLoading] = useState(false);

    const handleAddNewStaff = () => {
        const id = staff.length + 1;
        setStaff([...staff, { id, ...newStaff }]);
        setIsNewStaffModalOpen(false);
        setNewStaff({
            name: '',
            role: '',
            email: '',
            phone: '',
            dateHired: new Date().toISOString().split('T')[0],
            status: 'Active',
            officeLocation: 'Main Office',
            department: '',
            avatar: '/path/to/default-avatar.jpg'
        });
    };
    
    const handleInputChange = (e) => {
        setEditedStaff({ ...editedStaff, [e.target.name]: e.target.value });
    };
    
    const handleSaveGeneral = () => {
        setSelectedStaff(editedStaff);
        setStaff(staff.map(s => s.id === editedStaff.id ? editedStaff : s));
        setIsEditingGeneral(false);
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

    const handleProfilePictureUpload = () => {
        // Here you would typically send the new profile picture to your server
        // For now, we'll just update the local state
        setStaff(staff.map(s => 
            s.id === selectedStaff.id ? {...s, avatar: newProfilePicture} : s
        ));
        setSelectedStaff({...selectedStaff, avatar: newProfilePicture});
        setNewProfilePicture(null);
    };

    const filteredStaff = React.useMemo(() => {
        setIsLoading(true);
        try {
            const filtered = staff.filter((member) => {
                const searchLower = searchQuery.toLowerCase();
                const matchesSearch = !searchQuery || 
                    member.name.toLowerCase().includes(searchLower) ||
                    member.role.toLowerCase().includes(searchLower) ||
                    member.department.toLowerCase().includes(searchLower);

                switch (filterBy) {
                    case "active":
                        return matchesSearch && member.status === "Active";
                    case "department":
                        return matchesSearch && member.department === selectedStaff.department;
                    case "role":
                        return matchesSearch && member.role === selectedStaff.role;
                    default:
                        return matchesSearch;
                }
            });
            return filtered;
        } finally {
            setIsLoading(false);
        }
    }, [staff, searchQuery, filterBy, selectedStaff]);

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
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-12 gap-8">
                    {/* Staff List Sidebar */}
                    <div className="col-span-4">
                        <Card className="sticky top-6">
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
                                <div className="space-y-3">
                                    <Input
                                        placeholder="Search staff..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Select value={filterBy} onValueChange={setFilterBy}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Filter by..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Staff</SelectItem>
                                            <SelectItem value="active">Active Only</SelectItem>
                                            <SelectItem value="department">Same Department</SelectItem>
                                            <SelectItem value="role">Same Role</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>

                            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
                                <CardContent className="p-3">
                                    {isLoading ? (
                                        <div className="flex justify-center items-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin text-olive-600" />
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {filteredStaff.map((member) => (
                                                <div 
                                                    key={member.id} 
                                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                                        selectedStaff.id === member.id 
                                                            ? 'bg-olive-50 dark:bg-olive-900/30' 
                                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                                    }`}
                                                    onClick={() => setSelectedStaff(member)}
                                                >
                                                    <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                                                        <AvatarImage src={member.avatar} alt={member.name} />
                                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium truncate dark:text-gray-100">{member.name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{member.role}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </div>
                        </Card>
                    </div>

                    {/* Staff Details */}
                    <div className="col-span-8 space-y-6">
                        {/* Profile Card */}
                        <Card>
                            <CardContent className="flex items-center gap-6 p-6">
                                <Avatar className="w-24 h-24 border-4 border-olive-600/10">
                                    <AvatarImage src={selectedStaff.avatar} alt={selectedStaff.name} />
                                    <AvatarFallback>{selectedStaff.name.charAt(0)}</AvatarFallback>
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
                                        <Input
                                            id="role"
                                            name="role"
                                            value={isEditingGeneral ? editedStaff.role : selectedStaff.role}
                                            onChange={handleInputChange}
                                            disabled={!isEditingGeneral}

                                        />
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
                                        <Input
                                            id="status"
                                            name="status"
                                            value={isEditingAdditional ? editedStaff.status : selectedStaff.status}
                                            onChange={handleInputChange}
                                            disabled={!isEditingAdditional}

                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

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
                            <Input
                                id="newRole"
                                value={newStaff.role}
                                onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                            />
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update Profile Picture</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <Avatar className="w-40 h-40">
                                    <AvatarImage 
                                        src={newProfilePicture || selectedStaff.avatar} 
                                        alt={selectedStaff.name}
                                    />
                                    <AvatarFallback>{selectedStaff.name.charAt(0)}</AvatarFallback>
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
        </AdminLayout>
    );
}