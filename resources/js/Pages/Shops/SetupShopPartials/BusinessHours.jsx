import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import DayBusinessHours from './DayBusinessHours';
import ResubmitForm from '@/Components/ResubmitForm';

// Constants
const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DEFAULT_OPEN_TIME = '09:00:00';
const DEFAULT_CLOSE_TIME = '17:00:00';

// Generates the default structure for business hours, defaulting to closed
const generateDefaultHoursObject = () => {
    const hoursObject = {};
    daysOfWeek.forEach((day, index) => {
        hoursObject[index] = {
            day: day,
            is_open: false, // Default to closed
            open_time: DEFAULT_OPEN_TIME,
            close_time: DEFAULT_CLOSE_TIME
        };
    });
    return hoursObject;
};

// Component to create business hours for a shop
const BusinessHours = ({ data, setData, errors }) => {
    // Local state for client-side time validation errors
    const [timeValidationErrors, setTimeValidationErrors] = useState({});

    // Initialize business hours in parent form data if not present
    useEffect(() => {
        if (!data.business_hours) {
            setData('business_hours', generateDefaultHoursObject());
        }
    }, []);

    // Generate time slots for dropdowns (memoized for performance)
    const timeslots = useMemo(() => {
        return Array.from({ length: 48 }, (_, i) => {
            const hour = Math.floor(i / 2).toString().padStart(2, '0');
            const minute = (i % 2 === 0 ? '00' : '30');
            return `${hour}:${minute}:00`;
        });
    }, []);

    // Format time for display in dropdowns (memoized for performance)
    const formatTimeSlot = useCallback((time) => {
        if (!time) return "Select time";
        const [hour, minute] = time.split(':');
        const hourNum = parseInt(hour, 10);
        const period = hourNum >= 12 ? 'PM' : 'AM';
        const formattedHour = hourNum % 12 || 12;
        return `${formattedHour}:${minute} ${period}`;
    }, []);

    // Update specific day's data in the parent form state
    const updateDayData = useCallback((dayIndex, field, value) => {
        setData(prevData => ({
            ...prevData,
            business_hours: {
                ...prevData.business_hours,
                [dayIndex]: {
                    ...prevData.business_hours[dayIndex],
                    [field]: value,
                }
            }
        }));
    }, [setData]);

    // Handle toggling the open/closed switch for a day
    const handleSwitchChange = useCallback((day, checked) => {
        const dayIndex = daysOfWeek.indexOf(day);
        if (dayIndex === -1) return;
        updateDayData(dayIndex, 'is_open', checked);
    }, [updateDayData]);

    // Handle changing the open or close time for a day
    const handleTimeChange = useCallback((day, type, value) => {
        const dayIndex = daysOfWeek.indexOf(day);
        if (dayIndex === -1) return;
        updateDayData(dayIndex, `${type}_time`, value);
    }, [updateDayData]);

    // Render individual day configuration
    const renderDaySection = (day, index) => {
        if (!data.business_hours) return null;

        // Check for server-side validation errors for this day
        const dayErrors = {
            open_time: errors[`business_hours.${index}.open_time`],
            close_time: errors[`business_hours.${index}.close_time`],
            is_open: errors[`business_hours.${index}.is_open`],
            day: errors[`business_hours.${index}.day`],
            general: errors[`business_hours.${index}`],
        };

        // Filter out undefined errors
        const filteredDayErrors = Object.entries(dayErrors).reduce((acc, [key, value]) => {
            if (value) {
                acc[key] = value;
            }
            return acc;
        }, {});

        return (
            <DayBusinessHours
                key={day}
                day={day}
                dayData={data.business_hours[index]}
                errors={filteredDayErrors}
                timeslots={timeslots}
                formatTimeSlot={formatTimeSlot}
                handleSwitchChange={handleSwitchChange}
                handleTimeChange={handleTimeChange}
            />
        );
    };

    return (
        <ResubmitForm
            title="Set Business Hours"
            icon="AlarmClock"
        >
            <div>
                {data.business_hours && daysOfWeek.map(renderDaySection)}
                {typeof errors.business_hours === 'string' && (
                    <p className="text-red-500 text-xs mt-2">{errors.business_hours}</p>
                )}
            </div>
        </ResubmitForm>
    );
};

export default BusinessHours;
