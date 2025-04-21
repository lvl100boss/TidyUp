import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Instagram,
    Facebook,
    Twitter,
    Youtube,
    Globe,
    Pencil,
    Plus,
    Trash2,
    X
} from "lucide-react";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ShopSocialMedia = ({ shop, isOwnerOrManager }) => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const { data: addData, setData: setAddData, post: addPost, processing: addProcessing, reset: addReset } = useForm({
        name: "",
        url: "",
        icon: ""
    });

    const { data: editData, setData: setEditData, patch: editPatch, processing: editProcessing, reset: editReset } = useForm({
        name: "",
        url: "",
        icon: "",
    });

    const { delete: deleteAction, processing: deleteProcessing } = useForm();

    const socialMediaIcons = {
        Instagram: <Instagram className="h-5 w-5" />,
        Facebook: <Facebook className="h-5 w-5" />,
        Twitter: <Twitter className="h-5 w-5" />,
        Youtube: <Youtube className="h-5 w-5" />,
        Globe: <Globe className="h-5 w-5" />
    };

    const handleIconChange = (icon, formType = 'add') => {
        const data = formType === 'add' ? addData : editData;
        const setData = formType === 'add' ? setAddData : setEditData;

        // Automatically set name based on the icon selected (except for Globe)
        if (icon !== 'Globe') {
            setData({
                ...data,
                icon,
                name: icon
            });
        } else {
            setData({
                ...data,
                icon
            });
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        addPost(route('shop.social-media.store'), {
            onSuccess: () => {
                setIsAddOpen(false);
                addReset();
            },
        });
    };

    const handleEdit = (id) => {
        const socialMedia = shop.social_media.find((sm) => sm.id === id);
        setEditingId(id);
        setEditData({
            name: socialMedia.name,
            url: socialMedia.url,
            icon: socialMedia.icon
        });
        setIsEditOpen(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editPatch(route('shop.social-media.update', editingId), {
            onSuccess: () => {
                setIsEditOpen(false);
                editReset();
            },
            onError: (errors) => {
            }
        });
    };

    const handleDelete = (id) => {
        setDeletingId(id);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        deleteAction(route('shop.social-media.destroy', deletingId), {
            onSuccess: () => {
                setIsDeleteOpen(false);
            },
            onError: (errors) => {
            }
        });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Social Media</CardTitle>
                        {isOwnerOrManager && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAddOpen(true)}
                                className="h-9 w-9 p-0 rounded-full"
                            >
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Add Social Media</span>
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {shop.social_media && shop.social_media.length > 0 ? (
                        shop.social_media.map((social) => (
                            <div key={social.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {socialMediaIcons[social.icon]}
                                    <div>
                                        <p className="text-sm font-medium">{social.name}</p>
                                        <a
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-muted-foreground hover:underline"
                                        >
                                            {social.url}
                                        </a>
                                    </div>
                                </div>
                                {isOwnerOrManager && (
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={() => handleEdit(social.id)}
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 hover:text-red-500"
                                            onClick={() => handleDelete(social.id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-muted-foreground">
                            <p className="mb-2">No social media added yet</p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => setIsAddOpen(true)}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Social Media
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add Social Media Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Social Media</DialogTitle>
                        <DialogDescription>
                            Add a new social media profile for your shop.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAdd}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="add-icon">Platform</Label>
                                <Select
                                    name="icon"
                                    value={addData.icon}
                                    onValueChange={(value) => handleIconChange(value, 'add')}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Instagram">
                                            <div className="flex items-center gap-2">
                                                <Instagram className="h-4 w-4" />
                                                <span>Instagram</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Facebook">
                                            <div className="flex items-center gap-2">
                                                <Facebook className="h-4 w-4" />
                                                <span>Facebook</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Twitter">
                                            <div className="flex items-center gap-2">
                                                <Twitter className="h-4 w-4" />
                                                <span>Twitter</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Youtube">
                                            <div className="flex items-center gap-2">
                                                <Youtube className="h-4 w-4" />
                                                <span>YouTube</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Globe">
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4" />
                                                <span>Other</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {addData.icon === 'Globe' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="add-name">Platform Name</Label>
                                    <Input
                                        id="add-name"
                                        value={addData.name}
                                        onChange={(e) => setAddData('name', e.target.value)}
                                        placeholder="e.g., LinkedIn, TikTok"
                                    />
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="add-url">URL</Label>
                                <Input
                                    id="add-url"
                                    type="url"
                                    value={addData.url}
                                    onChange={(e) => setAddData('url', e.target.value)}
                                    placeholder="https://"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={addProcessing || !addData.icon || !addData.name || !addData.url}
                            >
                                {addProcessing ? "Adding..." : "Add"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Social Media Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Social Media</DialogTitle>
                        <DialogDescription>
                            Update your social media details.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-icon">Platform</Label>
                                <Select
                                    name="icon"
                                    value={editData.icon}
                                    onValueChange={(value) => handleIconChange(value, 'edit')}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Instagram">
                                            <div className="flex items-center gap-2">
                                                <Instagram className="h-4 w-4" />
                                                <span>Instagram</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Facebook">
                                            <div className="flex items-center gap-2">
                                                <Facebook className="h-4 w-4" />
                                                <span>Facebook</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Twitter">
                                            <div className="flex items-center gap-2">
                                                <Twitter className="h-4 w-4" />
                                                <span>Twitter</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Youtube">
                                            <div className="flex items-center gap-2">
                                                <Youtube className="h-4 w-4" />
                                                <span>YouTube</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Globe">
                                            <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4" />
                                                <span>Other</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {editData.icon === 'Globe' && (
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Platform Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={editData.name}
                                        onChange={(e) => setEditData('name', e.target.value)}
                                        placeholder="e.g., LinkedIn, TikTok"
                                    />
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="edit-url">URL</Label>
                                <Input
                                    id="edit-url"
                                    type="url"
                                    value={editData.url}
                                    onChange={(e) => setEditData('url', e.target.value)}
                                    placeholder="https://"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editProcessing || !editData.icon || !editData.name || !editData.url}
                            >
                                {editProcessing ? "Updating..." : "Update"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Social Media</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this social media? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={deleteProcessing}
                        >
                            {deleteProcessing ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ShopSocialMedia;