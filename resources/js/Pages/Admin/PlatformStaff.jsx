import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { DialogFooter } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

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
    return (
        <AdminLayout>
            <Head title="Platform Staff" />
            <div className="container mx-auto px-4 py-8 space-y-6">
                <div className="flex gap-6">
                    <Card className="w-1/3 dark:border-gray-700">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="w-32 h-32">
                                    <AvatarImage src={selectedStaff.avatar} alt={selectedStaff.name} />
                                    <AvatarFallback>{selectedStaff.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h2 className="text-2xl font-bold dark:text-gray-100">{selectedStaff.name}</h2>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button 
                                            variant="outline" 
                                            className="w-full border-olive-600 text-olive-600 hover:bg-olive-50 dark:border-olive-500 dark:text-olive-500 dark:hover:bg-olive-900/20 transition-all duration-200 ease-in-out"
                                        >
                                            Edit Profile Picture
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] dark:border-gray-700 dark:bg-gray-900">
                                        <DialogHeader>
                                            <DialogTitle className="text-center text-xl font-bold dark:text-gray-100">
                                                Update Profile Picture
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-6 py-4">
                                            <div className="flex flex-col items-center space-y-4">
                                                <div className="relative">
                                                    <Avatar className="w-40 h-40 border-4 border-olive-600">
                                                        <AvatarImage 
                                                            src={newProfilePicture || selectedStaff.avatar} 
                                                            alt={selectedStaff.name}
                                                            className="object-cover"
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
                                                <div className="w-full max-w-sm space-y-2">
                                                    <Label htmlFor="picture" className="text-sm font-medium block text-center">
                                                        Choose a new profile picture
                                                    </Label>
                                                    <Input
                                                        id="picture"
                                                        type="file"
                                                        onChange={handleProfilePictureChange}
                                                        accept="image/*"
                                                        className="border-2 border-dashed border-olive-600 p-4 text-center"
                                                    />
                                                    <p className="text-xs text-gray-500 text-center">
                                                        Supported formats: JPG, PNG, GIF (Max size: 5MB)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter className="sm:justify-center">
                                            <div className="flex space-x-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setNewProfilePicture(null);
                                                        setIsDialogOpen(false);
                                                    }}
                                                    className="border-olive-600 text-olive-600 hover:bg-olive-50 dark:border-olive-500 dark:text-olive-500 dark:hover:bg-olive-900/20"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleProfilePictureUpload}
                                                    disabled={!newProfilePicture}
                                                    className="bg-olive-600 text-white hover:bg-olive-700 dark:bg-olive-700 dark:hover:bg-olive-600 disabled:bg-gray-400 dark:disabled:bg-gray-600"
                                                >
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardContent>
                        <CardHeader>
                            <CardTitle>Staff List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {staff.map((member) => (
                                    <div 
                                        key={member.id} 
                                        className={`flex items-center space-x-4 p-2 rounded-md transition-colors duration-200 ${
                                            selectedStaff.id === member.id 
                                                ? 'bg-olive-50 dark:bg-olive-900/30' 
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }`}
                                        onClick={() => setSelectedStaff(member)}
                                        role="button"
                                        tabIndex={0}
                                    >
                                        <Avatar>
                                            <AvatarImage src={member.avatar} alt={member.name} />
                                            <AvatarFallback className="dark:bg-gray-700">{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium dark:text-gray-100">{member.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{member.role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="w-2/3 space-y-6">
                        <Card className="dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center dark:text-gray-100">
                                    General Information
                                    {isEditingGeneral ? (
                                        <div>
                                            <Button 
                                                onClick={handleSaveGeneral} 
                                                className="mr-2"
                                            >
                                                Save
                                            </Button>
                                            <Button 
                                                onClick={handleCancelGeneral} 
                                                variant="outline" 
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button 
                                            onClick={startEditingGeneral} 
                                            variant="outline" 
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="name" className="dark:text-gray-200">Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={isEditingGeneral ? editedStaff.name : selectedStaff.name}
                                            onChange={handleInputChange}
                                            disabled={!isEditingGeneral}
                                            className={!isEditingGeneral 
                                                ? "bg-gray-50 dark:bg-gray-800 cursor-default dark:text-gray-300 dark:border-gray-600" 
                                                : "dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600"
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="role" className="dark:text-gray-200">Role</Label>
                                        <Input
                                            id="role"
                                            name="role"
                                            value={isEditingGeneral ? editedStaff.role : selectedStaff.role}
                                            onChange={handleInputChange}
                                            disabled={!isEditingGeneral}
                                            className={!isEditingGeneral 
                                                ? "bg-gray-50 dark:bg-gray-800 cursor-default dark:text-gray-300 dark:border-gray-600" 
                                                : "dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600"
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            value={isEditingGeneral ? editedStaff.email : selectedStaff.email}
                                            onChange={handleInputChange}
                                            disabled={!isEditingGeneral}
                                            className={!isEditingGeneral 
                                                ? "bg-gray-50 dark:bg-gray-800 cursor-default dark:text-gray-300 dark:border-gray-600" 
                                                : "dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600"
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone" className="dark:text-gray-200">Phone</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={isEditingGeneral ? editedStaff.phone : selectedStaff.phone}
                                            onChange={handleInputChange}
                                            disabled={!isEditingGeneral}
                                            className={!isEditingGeneral 
                                                ? "bg-gray-50 dark:bg-gray-800 cursor-default dark:text-gray-300 dark:border-gray-600" 
                                                : "dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600"
                                            }
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center dark:text-gray-100">
                                    Additional Information
                                    {isEditingAdditional ? (
                                        <div>
                                            <Button 
                                                onClick={handleSaveAdditional} 
                                                className="mr-2"
                                            >
                                                Save
                                            </Button>
                                            <Button 
                                                onClick={handleCancelAdditional} 
                                                variant="outline" 

                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button 
                                            onClick={startEditingAdditional} 
                                            variant="outline" 
                                            className="border-olive-600 text-olive-600 hover:bg-olive-50 hover:text-olive-700 active:bg-olive-100 active:text-olive-800 transition-colors dark:border-olive-500 dark:text-olive-500 dark:hover:bg-olive-900/20"
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="externalLink" className="dark:text-gray-200">External Link</Label>
                                        <Input
                                            id="externalLink"
                                            name="externalLink"
                                            value={isEditingAdditional ? editedStaff.externalLink : selectedStaff.externalLink}
                                            onChange={handleInputChange}
                                            disabled={!isEditingAdditional}
                                            className={!isEditingAdditional 
                                                ? "bg-gray-50 dark:bg-gray-800 cursor-default dark:text-gray-300 dark:border-gray-600" 
                                                : "dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600"
                                            }
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="dateHired" className="dark:text-gray-200">Date Hired</Label>
                                            <Input
                                                id="dateHired"
                                                name="dateHired"
                                                type="date"
                                                value={isEditingAdditional ? editedStaff.dateHired : selectedStaff.dateHired || "2021-08-01"}
                                                onChange={handleInputChange}
                                                disabled={!isEditingAdditional}
                                                className={!isEditingAdditional 
                                                    ? "bg-gray-50 dark:bg-gray-800 cursor-default dark:text-gray-300 dark:border-gray-600" 
                                                    : "dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600"
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="status" className="dark:text-gray-200">Status</Label>
                                            <Input
                                                id="status"
                                                name="status"
                                                value={isEditingAdditional ? editedStaff.status : selectedStaff.status || "Active"}
                                                onChange={handleInputChange}
                                                disabled={!isEditingAdditional}
                                                className={!isEditingAdditional 
                                                    ? "bg-gray-50 dark:bg-gray-800 cursor-default dark:text-gray-300 dark:border-gray-600" 
                                                    : "dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600"
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="officeLocation" className="dark:text-gray-200">Office Location</Label>
                                            <Input
                                                id="officeLocation"
                                                name="officeLocation"
                                                value={isEditingAdditional ? editedStaff.officeLocation : selectedStaff.officeLocation || "N/A"}
                                                onChange={handleInputChange}
                                                disabled={!isEditingAdditional}
                                                className={!isEditingAdditional 
                                                    ? "bg-gray-50 dark:bg-gray-800 cursor-default dark:text-gray-300 dark:border-gray-600" 
                                                    : "dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600"
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="department" className="dark:text-gray-200">Department</Label>
                                            <Input
                                                id="department"
                                                name="department"
                                                value={isEditingAdditional ? editedStaff.department : selectedStaff.department || "N/A"}
                                                onChange={handleInputChange}
                                                disabled={!isEditingAdditional}
                                                className={!isEditingAdditional 
                                                    ? "bg-gray-50 dark:bg-gray-800 cursor-default dark:text-gray-300 dark:border-gray-600" 
                                                    : "dark:bg-gray-900 dark:text-gray-200 dark:border-gray-600"
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}