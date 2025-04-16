import React, { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    regions,
    provinces,
    cities,
    barangays,
} from "select-philippines-address";
import { Label } from "@/Components/ui/label"
import InputError from "./InputError";

const EditLocationSelect = ({ data, setData, errors }) => {
    const [regionData, setRegionData] = useState([]);
    const [provinceData, setProvinceData] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [barangayData, setBarangayData] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedBarangay, setSelectedBarangay] = useState("");

    // Load regions on component mount
    useEffect(() => {
        regions().then((response) => {
            setRegionData(response);
        });
    }, []);

    useEffect(() => {
        if (regionData.length && data.region) {
            const found = regionData.find(r => r.region_name === data.region);
            if (found) {
                setSelectedRegion(found.region_code);
                provinces(found.region_code).then((res) => setProvinceData(res));
            }
        }
    }, [regionData]);

    useEffect(() => {
        if (provinceData.length && data.province) {
            const found = provinceData.find(p => p.province_name === data.province);
            if (found) {
                setSelectedProvince(found.province_code);
                cities(found.province_code).then((res) => setCityData(res));
            }
        }
    }, [provinceData]);

    useEffect(() => {
        if (cityData.length && data.city) {
            const found = cityData.find(c => c.city_name === data.city);
            if (found) {
                setSelectedCity(found.city_code);
                barangays(found.city_code).then((res) => setBarangayData(res));
            }
        }
    }, [cityData]);

    useEffect(() => {
        if (barangayData.length && data.barangay) {
            const found = barangayData.find(b => b.brgy_name === data.barangay);
            if (found) {
                setSelectedBarangay(found.brgy_code);
            }
        }
    }, [barangayData]);

    // Handle region selection
    const handleRegionChange = (code) => {
        const found = regionData.find(r => r.region_code === code);
        setSelectedRegion(code);
        setData('region', found?.region_name || '');
        setData('province', '');
        setData('city', '');
        setData('barangay', '');
        setProvinceData([]);
        setCityData([]);
        setBarangayData([]);

        provinces(code).then((response) => {
            setProvinceData(response);
        });
    };

    // Handle province selection
    const handleProvinceChange = (code) => {
        const found = provinceData.find(p => p.province_code === code);
        setSelectedProvince(code);
        setData('province', found?.province_name || '');
        setSelectedCity("");
        setSelectedBarangay("");
        setCityData([]);
        setBarangayData([]);

        cities(code).then((response) => {
            setCityData(response);
        });
    };

    // Handle city selection
    const handleCityChange = (code) => {
        const found = cityData.find(c => c.city_code === code);
        setSelectedCity(code);
        setData('city', found?.city_name || '');
        setSelectedBarangay("");
        setBarangayData([]);

        barangays(code).then((response) => {
            setBarangayData(response);
        });
    };

    // Handle barangay selection
    const handleBarangayChange = (code) => {
        const found = barangayData.find(b => b.brgy_code === code);
        setSelectedBarangay(code);
        setData('barangay', found?.brgy_name || '');
    };

    return (
        <div className="flex flex-col space-y-4 mb-4">
            <div>
                <Label
                    htmlFor="region"
                    className="text-sm font-medium"
                >
                    Region
                </Label>
                <Select value={selectedRegion} onValueChange={handleRegionChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent>
                        {regionData.map((region) => (
                            <SelectItem
                                key={region.region_code}
                                value={region.region_code}
                            >
                                {region.region_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.region} className="mt-2" />
            </div>

            <div>
                <Label
                    htmlFor="province"
                    className="text-sm font-medium"
                >
                    Province
                </Label>
                <Select
                    value={selectedProvince}
                    onValueChange={handleProvinceChange}
                    disabled={!selectedRegion}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Province" />
                    </SelectTrigger>
                    <SelectContent>
                        {provinceData.map((province) => (
                            <SelectItem
                                key={province.province_code}
                                value={province.province_code}
                            >
                                {province.province_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.province} className="mt-2" />
            </div>

            <div>
                <Label
                    htmlFor="city"
                    className="text-sm font-medium"
                >
                    City/Municipality
                </Label>
                <Select
                    value={selectedCity}
                    onValueChange={handleCityChange}
                    disabled={!selectedProvince}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select City/Municipality" />
                    </SelectTrigger>
                    <SelectContent>
                        {cityData.map((city) => (
                            <SelectItem key={city.city_code} value={city.city_code}>
                                {city.city_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.city} className="mt-2" />
            </div>

            <div>
                <Label
                    htmlFor="barangay"
                    className="text-sm font-medium"
                >
                    Barangay
                </Label>
                <Select
                    value={selectedBarangay}
                    onValueChange={handleBarangayChange}
                    disabled={!selectedCity}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Barangay" />
                    </SelectTrigger>
                    <SelectContent>
                        {barangayData.map((barangay) => (
                            <SelectItem
                                key={barangay.brgy_code}
                                value={barangay.brgy_code}
                            >
                                {barangay.brgy_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.barangay} className="mt-2" />
            </div>
        </div>
    );
};

export default EditLocationSelect;
