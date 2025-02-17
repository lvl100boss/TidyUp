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

const PhilippineAddressSelect = ({ onLocationChange }) => {
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

    // Handle region selection
    const handleRegionChange = (value) => {
        setSelectedRegion(value);
        setSelectedProvince("");
        setSelectedCity("");
        setSelectedBarangay("");
        setProvinceData([]);
        setCityData([]);
        setBarangayData([]);

        provinces(value).then((response) => {
            setProvinceData(response);
        });
    };

    // Handle province selection
    const handleProvinceChange = (value) => {
        setSelectedProvince(value);
        setSelectedCity("");
        setSelectedBarangay("");
        setCityData([]);
        setBarangayData([]);

        cities(value).then((response) => {
            setCityData(response);
        });
    };

    // Handle city selection
    const handleCityChange = (value) => {
        setSelectedCity(value);
        setSelectedBarangay("");
        setBarangayData([]);

        barangays(value).then((response) => {
            setBarangayData(response);
        });
    };

    // Handle barangay selection
    const handleBarangayChange = (value) => {
        setSelectedBarangay(value);
    };

    // Update parent form whenever any selection changes
    useEffect(() => {
        onLocationChange?.({
            region: {
                code: selectedRegion,
                name: regionData.find((r) => r.region_code === selectedRegion)
                    ?.region_name,
            },
            province: {
                code: selectedProvince,
                name: provinceData.find(
                    (p) => p.province_code === selectedProvince
                )?.province_name,
            },
            city: {
                code: selectedCity,
                name: cityData.find((c) => c.city_code === selectedCity)
                    ?.city_name,
            },
            barangay: {
                code: selectedBarangay,
                name: barangayData.find((b) => b.brgy_code === selectedBarangay)
                    ?.brgy_name,
            },
        });
    }, [selectedRegion, selectedProvince, selectedCity, selectedBarangay]);

    return (
        <div className="flex flex-col space-y-4">
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
        </div>
    );
};

export default PhilippineAddressSelect;
