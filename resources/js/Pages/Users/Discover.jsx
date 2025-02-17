import UserLayout from "@/Layouts/UserLayout";
import React, { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon, MapPinIcon, PhoneIcon } from "lucide-react";

//to make this work execute npm install react-masonry-css
import Masonry from "react-masonry-css";

// Add this CSS in your stylesheet or add it inline in the component
const masonryStyles = {
    display: "flex",
    marginLeft: "-30px" /* gutter size offset */,
    width: "auto",
};

const masonryColumnStyles = {
    paddingLeft: "30px" /* gutter size */,
    backgroundClip: "padding-box",
};

export default function Discover({ shopss, categoriess }) {
    console.log(shopss);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all"); // Changed from empty string
    const [sortBy, setSortBy] = useState("rating");
    const [filteredShops, setFilteredShops] = useState([]);

    const shops = React.useMemo(
        () =>
            shopss.map((shop) => ({
                id: shop.id,
                image: shop.shop_gallery[0].url,
                name: shop.shop_name,
                rating: 4.8, // You might want to replace this with actual rating from data
                reviews: 256, // You might want to replace this with actual reviews count
                category: "Salon", // You might want to get this from shop data
                location: shop.detailed_address,
                phone: shop.contact_number,
                description: shop.bio,
                priceRange: "₱₱", // You might want to get this from shop data
            })),
        [shopss]
    );

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
        <UserLayout>
            <Head title="Explore" />
            <div className=" space-y-6">
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
                            {categoriess.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
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
                <Masonry
                    breakpointCols={{
                        default: 3,
                        1024: 2,
                        640: 1,
                    }}
                    className="flex -ml-8 w-auto"
                    columnClassName="pl-8"
                    style={masonryStyles}
                >
                    {filteredShops.map((shop) => (
                        <div key={shop.id} className="mb-8">
                            <Card className="overflow-hidden">
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src={`/${shop.image}`}
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
                                            {shop.rating} ({shop.reviews}{" "}
                                            reviews)
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
                                    <Link
                                        href={`/${shop.id}/shop`}
                                        className={`w-full  ${buttonVariants({
                                            variant: "default",
                                        })} figtree-semibold`}
                                    >
                                        View Shop
                                    </Link>
                                </CardFooter>
                            </Card>
                        </div>
                    ))}
                </Masonry>
            </div>
        </UserLayout>
    );
}
