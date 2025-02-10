import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import Header from "@/Components/User/Header";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import LocationSelect from "@/Components/LocationSelect";
import { Button } from "@/Components/ui/button";
import InputError from "@/Components/InputError";

export default function SetupShop({ branchCategories }) {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        shop_name: "",
        email: "",
        phone: "",
        region: "",
        province: "",
        city: "",
        barangay: "",
        detailed_address: "",
        categories: [],
    });

    const handleCategoryChange = (values) => {
        setData("categories", values);
    };

    const handleLocationChange = (locationData) => {
        setData({
            ...data,
            region: locationData.region.name,
            province: locationData.province.name,
            city: locationData.city.name,
            barangay: locationData.barangay.name,
        });
    };

    const submitForm = (e) => {
        e.preventDefault();
        post("/shop/setup", { preserveScroll: true });
    };

    useEffect(() => {
        // Retrieve the theme preference from local storage
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.body.classList.add("dark");
            setIsDarkTheme(true);
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkTheme) {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        setIsDarkTheme(!isDarkTheme);
    };
    return (
        <>
            <Head title="Shop Setup" />
            <section className="py-2 px-5 relative min-h-screen">
                <Header onClick={toggleTheme} isDarkTheme={isDarkTheme} />
                <div className="max-w-screen-md mx-auto">
                    <div>
                        <div className="mb-5">
                            <h1 className="figtree-semibold text-2xl">
                                Register your Shop
                            </h1>
                            <p className="text-muted-foreground">
                                Fill up your Shop's Information
                            </p>
                        </div>
                        <form onSubmit={submitForm}>
                            {/* Shop Name Field */}
                            <div className="mb-4">
                                <Label htmlFor="shop_name">Shop Name</Label>
                                <Input
                                    type="text"
                                    id="shop_name"
                                    name="shop_name"
                                    value={data.shop_name}
                                    onChange={(e) =>
                                        setData("shop_name", e.target.value)
                                    }
                                    placeholder="Enter your Shop's Name"
                                />
                                <InputError field="shop_name" errors={errors} />
                            </div>
                            {/* Category Name Field */}
                            <div className="mb-4">
                                <div className="mb-4">
                                    <Label htmlFor="branch_category">
                                        Category
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        You can select multiple categories that
                                        fit your shop.
                                    </p>
                                </div>
                                <div>
                                    <ToggleGroup
                                        type="multiple"
                                        size="lg"
                                        variant="outline"
                                        className="justify-start gap-2"
                                        value={data.categories} // Control the selected values
                                        onValueChange={handleCategoryChange} // Handle changes
                                    >
                                        {branchCategories.map((category) => (
                                            <ToggleGroupItem
                                                key={category.id}
                                                value={category.id.toString()} // Use ID as value
                                                aria-label={category.name}
                                            >
                                                {category.name}
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap mb-4">
                                <div className="flex-1 min-w-72">
                                    <div>
                                        <Label htmlFor="email">
                                            Business Email
                                        </Label>
                                        <Input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="Enter your Shop's email address"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-72">
                                    <div>
                                        <Label htmlFor="phone">
                                            Phone Number
                                        </Label>
                                        <Input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            placeholder="Enter your Shop's phone number"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="address">Address</Label>
                                <LocationSelect
                                    onLocationChange={handleLocationChange}
                                />
                                {/* for this to work u need to npm install select-philippines-address */}
                            </div>
                            <div className="mb-4">
                                <Label htmlFor="detailed_address">
                                    Detailed Address
                                </Label>
                                <Input
                                    type="text"
                                    id="detailed_address"
                                    name="detailed_address"
                                    value={data.detailed_address}
                                    onChange={(e) =>
                                        setData(
                                            "detailed_address",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your Shop's detailed address"
                                />
                            </div>
                            <div>
                                <Button
                                    type="submit"
                                    className="figtree-semibold"
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
