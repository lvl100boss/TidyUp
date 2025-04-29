import React, { useState, useEffect } from 'react'
import { Label } from '@/Components/ui/label'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/button'
import { ToggleGroup, ToggleGroupItem } from "@/Components/ui/toggle-group"
import { useForm, usePage, Head } from '@inertiajs/react'
import { toast } from 'sonner';
import { Textarea } from "@/Components/ui/textarea"
import { Component, Check } from 'lucide-react' // Import Check icon
import InputError from '@/Components/InputError'
import { motion, AnimatePresence } from 'framer-motion';
import ResubmitForm from '@/Components/ResubmitForm'
import { set } from 'date-fns'
const BasicDetails = ({ data, setData, errors }) => {

    // const { data, setData, post, processing, errors } = useForm({
    //     shop_name: "",
    //     bio: "",
    //     email: "",
    //     contact_number: "",
    //     shop_categories: [],
    // })



    // const submit = (e) => {
    //     e.preventDefault();

    //     const formData = new FormData();
    //     formData.append("shop_name", data.shop_name);
    //     formData.append("bio", data.bio);
    //     formData.append("email", data.email);
    //     formData.append("contact_number", data.contact_number);
    //     formData.append("shop_categories", data.shop_categories);

    //     post(route('shop.resubmission.basicDetails'), {
    //         preserveScroll: true,
    //         preserveState: true,
    //         data: formData,
    //         onSuccess: () => {
    //             // Handle success
    //             toast.success("Heads up!", {
    //                 description: "Your shop information has been updated.",
    //                 duration: 3000,
    //             });
    //         },
    //         onError: () => {
    //             // Handle error
    //             toast.error("Uh oh! Something went wrong.", {
    //                 description: "Please check your input and try again.",
    //                 duration: 3000,
    //             });
    //         },
    //     });
    // }

    return (
        <ResubmitForm
            title="Basic Information"
            icon="Component"
        >

            {/* <motion.form onSubmit={submit} className='mt-5'> */}
            <motion.div className='mt-5'>
                <div
                    className='mb-4'
                >
                    <Label htmlFor="shop_name" className="block mb-2">
                        Shop Name
                    </Label>
                    <Input
                        id="shop_name"
                        value={data.shop_name}
                        onChange={(e) => setData('shop_name', e.target.value)}
                        placeholder="Enter your shop name"
                        className=""
                    />
                    <InputError message={errors.shop_name} className="mb-2" />
                </div>
                <div
                    className='mb-4'
                >
                    <Label htmlFor="email" className="block mb-2">
                        Email
                    </Label>
                    <Input
                        id="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Enter your email"
                        className=""
                    />
                    <InputError message={errors.email} className="mb-2" />
                </div>
                <div
                    className='mb-4'
                >
                    <Label htmlFor="contact_number" className="block mb-2">
                        Contact Number
                    </Label>
                    <Input
                        id="contact_number"
                        value={data.contact_number}
                        onChange={(e) => setData('contact_number', e.target.value)}
                        placeholder="Enter your contact number"
                        className=""
                    />
                    <InputError message={errors.contact_number} className="m-2" />
                </div>
                <div

                    className='mb-4'
                >
                    <Label htmlFor="bio" className="block mb-2">
                        Shop Description/Bio
                    </Label>
                    <Textarea
                        id="bio"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        placeholder="Enter your shop description/bio"
                        className=""
                        rows={4}
                        maxLength={244}
                    />
                    <InputError message={errors.bio} className="m-2" />
                </div>
                <div

                >
                    <Label className="mb-2">
                        Shop Category
                    </Label>
                    <p className='text-xs text-muted-foreground'>Please Select a Category</p>
                    <div className='pt-2'>
                        <ToggleGroup
                            type="multiple"
                            variant="outline"
                            className="w-fit"
                            onValueChange={(value) => {
                                setData('shop_categories', value);
                            }}
                            value={data.shop_categories}
                        >
                            <ToggleGroupItem value="1" className="flex items-center gap-2">
                                {data.shop_categories.includes("1") && <Check size={16} />}
                                <span>Barbershop</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="2" className="flex items-center gap-2">
                                {data.shop_categories.includes("2") && <Check size={16} />}
                                <span>Hair Salon</span>
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <InputError message={errors.shop_categories} className="m-2" />
                </div>
            </motion.div>
        </ResubmitForm >
    )
}

export default BasicDetails