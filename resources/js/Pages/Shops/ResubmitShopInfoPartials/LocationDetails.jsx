import React, { useState, useEffect } from 'react'
import { Label } from '@/Components/ui/label'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/button'
import { ToggleGroup, ToggleGroupItem } from "@/Components/ui/toggle-group"
import { useForm, usePage, Head } from '@inertiajs/react'
import { toast } from 'sonner';
import { Textarea } from "@/Components/ui/textarea"
import { MapPin } from 'lucide-react'
import InputError from '@/Components/InputError'
import { motion, AnimatePresence } from 'framer-motion';
import EditLocationSelect from "@/Components/EditLocationSelect";
import ResubmitForm from '@/Components/ResubmitForm'

const LocationDetails = (props) => {

    const { data, setData, post, processing, errors } = useForm({
        _method: "PATCH",
        shop_id: props.shop.id,
        region: props.shop.region,
        province: props.shop.province,
        city: props.shop.city,
        barangay: props.shop.barangay,
        detailed_address: props.shop.detailed_address,
    })
    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_method", "PATCH");
        formData.append("shop_id", props.shop.id);
        formData.append("region", data.region);
        formData.append("province", data.province);
        formData.append("city", data.city);
        formData.append("barangay", data.barangay);
        formData.append("detailed_address", data.detailed_address);

        post(route('shop.resubmission.locationDetails'), {
            preserveScroll: true,
            preserveState: true,
            data: formData,
            onSuccess: () => {
                // Handle success
                toast.success("Heads up!", {
                    description: "Your shop information has been updated.",
                    duration: 3000,
                });
            },
            onError: () => {
                // Handle error
                toast.error("Uh oh! Something went wrong.", {
                    description: "Please check your input and try again.",
                    duration: 3000,
                });
            },
        });
    }

    const [dataChanged, setDataChanged] = useState(false);
    useEffect(() => {
        setDataChanged(
            data.region !== props.shop.region ||
            data.province !== props.shop.province ||
            data.city !== props.shop.city ||
            data.barangay !== props.shop.barangay ||
            data.detailed_address !== props.shop.detailed_address
        );
    }, [data, props.shop]);
    return (
        <ResubmitForm
            title="Location Details"
            icon="MapPin"
        >
            <form onSubmit={submit} className='mt-5'>
                <div>
                    <EditLocationSelect data={data} setData={setData} errors={errors} />

                    <div>
                        <Label htmlFor="detailed_address" className="text-sm font-medium">
                            Detailed Address
                        </Label>
                        <Input
                            type="text"
                            name="detailed_address"
                            id="detailed_address"
                            placeholder="ex. 1234 Main St, Barangay 1"
                            value={data.detailed_address}
                            onChange={(e) => setData('detailed_address', e.target.value)}
                            className="mt-2"
                        />
                        <InputError message={errors.detailed_address} className="mt-2" />
                    </div>
                </div>
                <AnimatePresence>
                    {dataChanged && (
                        <motion.div
                            className="flex justify-end mt-5"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <Button>Save</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </ResubmitForm>
    )
}

export default LocationDetails