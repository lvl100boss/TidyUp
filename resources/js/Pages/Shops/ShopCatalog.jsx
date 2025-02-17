import ShopsLayout from "@/Layouts/ShopsLayout";
import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon, MapPinIcon, PhoneIcon } from "lucide-react";

export default function ShopCatalog() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all"); // Changed from empty string
    const [sortBy, setSortBy] = useState("rating");
    const [filteredShops, setFilteredShops] = useState([]);
    // Sample data - replace with actual API data
    const shops = [
        {
            id: 1,
            name: "Glamour Salon & Spa",
            image: "https://source.unsplash.com/random/800x600?salon,1",
            rating: 4.8,
            reviews: 256,
            category: "Salon",
            location: "Manila, Philippines",
            phone: "+63 912 345 6789",
            description:
                "Premier beauty salon offering a wide range of services.",
            priceRange: "₱₱",
        },
        {
            id: 2,
            name: "Clean & Fresh Laundry",
            image: "https://source.unsplash.com/random/800x600?laundry,1",
            rating: 4.5,
            reviews: 128,
            category: "Laundry",
            location: "Quezon City, Philippines",
            phone: "+63 923 456 7890",
            description: "Professional laundry and dry cleaning services.",
            priceRange: "₱",
        },
        // Add more sample shops as needed
    ];

    useEffect(() => {
        let result = [...shops];

        // Apply search filter
        if (searchQuery) {
            result = result.filter(
                (shop) =>
                    shop.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    shop.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter
        if (selectedCategory && selectedCategory !== "all") {
            result = result.filter(
                (shop) =>
                    shop.category.toLowerCase() ===
                    selectedCategory.toLowerCase()
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case "rating":
                    return b.rating - a.rating;
                case "reviews":
                    return b.reviews - a.reviews;
                case "name":
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        setFilteredShops(result);
    }, [searchQuery, selectedCategory, sortBy, shops]);

    return (
        <ShopsLayout>
            <Head title="Shop Catalog" />

            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">Discover Services</h1>
                    <p className="text-muted-foreground">
                        Find and book the best services in your area
                    </p>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        placeholder="Search shops..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="salon">Salon</SelectItem>
                            <SelectItem value="laundry">Laundry</SelectItem>
                            <SelectItem value="cleaning">Cleaning</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="rating">Rating</SelectItem>
                            <SelectItem value="reviews">
                                Most Reviews
                            </SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Shop Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredShops.map((shop) => (
                        <Card key={shop.id} className="overflow-hidden">
                            <div className="aspect-video relative overflow-hidden">
                                <img
                                    src={shop.image}
                                    alt={shop.name}
                                    className="object-cover w-full h-full transition-transform hover:scale-105"
                                />
                                <Badge className="absolute top-4 right-4">
                                    {shop.category}
                                </Badge>
                            </div>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start">
                                    <span>{shop.name}</span>
                                    <Badge variant="secondary">
                                        {shop.priceRange}
                                    </Badge>
                                </CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <StarIcon className="h-4 w-4 text-yellow-400" />
                                    <span>
                                        {shop.rating} ({shop.reviews} reviews)
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    {shop.description}
                                </p>
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPinIcon className="h-4 w-4" />
                                    {shop.location}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <PhoneIcon className="h-4 w-4" />
                                    {shop.phone}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <a href={`/shops/${shop.id}`}>
                                        View Details
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </ShopsLayout>
    );
}
