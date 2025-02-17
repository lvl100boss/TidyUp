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
import Shop from "../Users/Shop";

function ShopNameField({ data, setData, errors }) {
    return (
        <div className="mb-5">
            <div className="mb-5">
                <Label htmlFor="shop_name" className="text-4xl figtree-bold">
                    Shop Name
                </Label>
                <Input
                    type="text"
                    name="shop_name"
                    value={data.shop_name}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("shop_name", e.target.value)}
                />
                <InputError error={errors.shop_name} />
            </div>
            <div className="">
                <Button className="figtree-bold uppercase">NEXT</Button>
            </div>
        </div>
    );
}

export default function SetupShop({ categories }) {
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
                <div className="">
                    <div className="max-w-screen-sm border p-5 rounded-md">
                        <div>
                            <div className="mb-5">
                                <h1 className="figtree-semibold text-2xl">
                                    Setup Your Shop
                                </h1>
                                <p className="text-muted-foreground">
                                    Fill up your Shop's Information
                                </p>
                            </div>
                            <form onSubmit={submitForm}>
                                <ShopNameField
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
