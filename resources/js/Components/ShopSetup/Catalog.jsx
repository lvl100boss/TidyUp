import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal, Trash2 } from "lucide-react";

const Catalog = ({
    serviceCategories,
    data,
    setData,
    setAllFieldsFilled,
    allFieldsFilled,
}) => {
    const [service, setService] = useState({
        service_name: "",
        cost: "",
        duration_hour: "",
        duration_minute: "",
        category_id: "",
        category_name: "",
    });
    const [alertAnimate, setAlertAnimate] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        setService({ ...service, [e.target.name]: e.target.value });
    };

    // Handle category selection
    const handleCategorySelect = (categoryId) => {
        const selectedCategory = serviceCategories.find(
            (cat) => cat.id === categoryId
        );
        setService({
            ...service,
            category_id: categoryId,
            category_name: selectedCategory.name,
        });
    };

    // Show alert with auto-hide
    const showAlert = () => {
        setAlertAnimate(true);
        setTimeout(() => {
            setAlertAnimate(false);
        }, 3000);
    };

    // Add service to catalog
    const addService = () => {
        if (!service.service_name || !service.cost || !service.category_id) {
            showAlert();
            return;
        }

        setData("catalog_items", [...data.catalog_items, service]);

        // Reset input fields
        setService({
            service_name: "",
            cost: "",
            duration_hour: "",
            duration_minute: "",
            category_id: "",
            category_name: "",
        });
    };

    // Remove service from catalog
    const removeService = (index) => {
        const updatedCatalog = data.catalog_items.filter((_, i) => i !== index);
        setData("catalog_items", updatedCatalog);
    };

    return (
        <div className=" space-y-4">
            <h2 className="text-xl font-semibold">Add Services</h2>
            {/* Service Input Fields */}
            <div className="grid grid-cols-1 gap-4">
                <Select
                    value={service.category_id}
                    onValueChange={handleCategorySelect}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category *" />
                    </SelectTrigger>
                    <SelectContent>
                        {serviceCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="grid grid-cols-4 gap-2">
                    <Input
                        type="text"
                        name="service_name"
                        placeholder="Service Name *"
                        value={service.service_name}
                        onChange={handleChange}
                    />
                    <Input
                        type="number"
                        name="cost"
                        placeholder="Cost *"
                        value={service.cost}
                        onChange={handleChange}
                    />
                    <Select
                        value={service.duration_hour}
                        onValueChange={(value) =>
                            handleChange({
                                target: { name: "duration_hour", value },
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Hours" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 13 }, (_, i) => i).map(
                                (hour) => (
                                    <SelectItem
                                        key={hour}
                                        value={hour.toString()}
                                    >
                                        {hour}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>

                    <Select
                        value={service.duration_minute}
                        onValueChange={(value) =>
                            handleChange({
                                target: { name: "duration_minute", value },
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Minutes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">0</SelectItem>
                            {Array.from(
                                { length: 11 },
                                (_, i) => i * 5 + 5
                            ).map((minutes) => (
                                <SelectItem
                                    key={minutes}
                                    value={minutes.toString()}
                                >
                                    {minutes}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {/* Add Service Button */}
            <Button type="button" onClick={addService} className="w-full">
                Add Service
            </Button>
            {/* Display Added Services */}
            {data.catalog_items.length > 0 && (
                <Table className="mt-4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Service Name</TableHead>
                            <TableHead>Cost</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.catalog_items.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.category_name}</TableCell>
                                <TableCell>{item.service_name}</TableCell>
                                <TableCell>₱{item.cost}</TableCell>
                                <TableCell>
                                    {item.duration_hour}h {item.duration_minute}
                                    m
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeService(index)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            {/* Alert Component */}
            <Alert
                className={`bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 fixed bottom-10 right-5 max-w-lg transform transition-all duration-500 ${
                    alertAnimate
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-5"
                }`}
            >
                <Terminal className="h-4 w-4 stroke-yellow-700" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                    Please fill in all required fields (Service Name, Cost, and
                    Category).
                </AlertDescription>
            </Alert>
        </div>
    );
};

export default Catalog;
