import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlarmClock, Save } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';
import DayBusinessHours from './DayBusinessHours';
import ResubmitForm from '@/Components/ResubmitForm';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const DEFAULT_OPEN_TIME = '09:00:00';
const DEFAULT_CLOSE_TIME = '17:00:00';

const transformHoursArrayToObject = (hoursArray) => {
    const hoursObject = {};
    daysOfWeek.forEach((day, index) => {
        hoursObject[index] = {
            id: null,
            day: day,
            is_open: true,
            open_time: DEFAULT_OPEN_TIME,
            close_time: DEFAULT_CLOSE_TIME
        };
    });

    if (!Array.isArray(hoursArray)) {
        console.warn("Business hours data is not an array, using defaults:", hoursArray);
        return hoursObject;
    }

    hoursArray.forEach(item => {
        const index = daysOfWeek.indexOf(item.day);
        if (index !== -1) {
            hoursObject[index] = {
                id: item.id,
                day: item.day,
                is_open: !!item.is_open,
                open_time: item.open_time || DEFAULT_OPEN_TIME,
                close_time: item.close_time || DEFAULT_CLOSE_TIME,
            };
        }
    });
    return hoursObject;
};

const transformHoursObjectToArray = (hoursObject) => {
    return Object.values(hoursObject).map(times => ({
        id: times.id,
        day: times.day,
        is_open: times.is_open ? 1 : 0,
        open_time: times.open_time,
        close_time: times.close_time,
    }));
};

const validateTimeRange = (openTime, closeTime) => {
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    const openTotal = openHour * 60 + openMinute;
    const closeTotal = closeHour * 60 + closeMinute;

    return closeTotal > openTotal;
};

const BusinessHours = ({ shop, changeDetected, setChangeDetected }) => {
    const initialHoursObject = useMemo(() => transformHoursArrayToObject(shop.business_hours), [shop.business_hours]);

    const { data, setData, post, processing, errors } = useForm({
        _method: "PATCH",
        shop_id: shop.id,
        business_hours: initialHoursObject,
    });

    const [dataChanged, setDataChanged] = React.useState(false);
    const [validationErrors, setValidationErrors] = React.useState({});

    React.useEffect(() => {
        const hasChanged = Object.keys(data.business_hours).some((key) => {
            const currentItem = data.business_hours[key];
            const initialItem = initialHoursObject[key];

            return (
                initialItem &&
                (currentItem.is_open !== initialItem.is_open ||
                    currentItem.open_time !== initialItem.open_time ||
                    currentItem.close_time !== initialItem.close_time)
            );
        });
        setDataChanged(hasChanged);
    }, [data.business_hours, initialHoursObject]);

    const timeslots = useMemo(() => {
        return Array.from({ length: 48 }, (_, i) => {
            const hour = Math.floor(i / 2).toString().padStart(2, '0');
            const minute = (i % 2 === 0 ? '00' : '30');
            return `${hour}:${minute}:00`;
        });
    }, []);

    const formatTimeSlot = useCallback((time) => {
        if (!time) return "Select time";
        const [hour, minute] = time.split(':');
        const hourNum = parseInt(hour, 10);
        const period = hourNum >= 12 ? 'PM' : 'AM';
        const formattedHour = hourNum % 12 || 12;
        return `${formattedHour}:${minute} ${period}`;
    }, []);

    const handleSwitchChange = useCallback((day, checked) => {
        const index = daysOfWeek.indexOf(day);
        if (index === -1) return;

        setData(prevData => ({
            ...prevData,
            business_hours: {
                ...prevData.business_hours,
                [index]: {
                    ...prevData.business_hours[index],
                    is_open: checked,
                }
            }
        }));
    }, [setData]);

    const handleTimeChange = useCallback((day, type, value) => {
        const index = daysOfWeek.indexOf(day);
        if (index === -1) return;

        const newData = {
            ...data.business_hours,
            [index]: {
                ...data.business_hours[index],
                [`${type}_time`]: value,
            }
        };

        // Validate time range
        if (type === 'close' && newData[index].is_open) {
            const isValid = validateTimeRange(newData[index].open_time, value);
            setValidationErrors(prev => ({
                ...prev,
                [`${day}_time`]: isValid ? null : 'Closing time must be after opening time'
            }));
        }

        setData(prevData => ({
            ...prevData,
            business_hours: newData
        }));
    }, [setData, data.business_hours]);

    const submit = (e) => {
        e.preventDefault();

        // Validate all time ranges
        const newValidationErrors = {};
        Object.entries(data.business_hours).forEach(([index, dayData]) => {
            if (dayData.is_open && !validateTimeRange(dayData.open_time, dayData.close_time)) {
                newValidationErrors[`${dayData.day}_time`] = 'Closing time must be after opening time';
            }
        });

        if (Object.keys(newValidationErrors).length > 0) {
            setValidationErrors(newValidationErrors);
            toast.error("Invalid time ranges", {
                description: "Please ensure closing times are after opening times for all open days.",
                duration: 3000,
            });
            return;
        }

        const transformedHours = transformHoursObjectToArray(data.business_hours);

        post(route('shop.resubmission.businessHours'), {
            data: {
                _method: "PATCH",
                shop_id: data.shop_id,
                business_hours: transformedHours,
            },
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success("Business Hours Updated!", {
                    description: "Your shop's business hours have been saved.",
                    duration: 3000,
                });
                if (changeDetected) return;
                setChangeDetected(true);
                setValidationErrors({});
            },
            onError: (formErrors) => {
                console.error("Form Errors:", formErrors);
                const bhErrors = formErrors.business_hours || Object.keys(formErrors)
                    .filter(key => key.startsWith('business_hours.'))
                    .map(key => formErrors[key])
                    .join(' ') || Object.values(formErrors).find(err => typeof err === 'string' && err.includes('business hours'));

                toast.error("Uh oh! Something went wrong.", {
                    description: bhErrors || "Please check your input and try again.",
                    duration: 3000,
                });
            },
        });
    };

    const renderDaySection = (day, index) => {
        const indexedErrors = {};
        Object.keys(errors).forEach(key => {
            const match = key.match(/^business_hours\.(\d+)\.(.+)$/);
            if (match && parseInt(match[1], 10) === index) {
                indexedErrors[`business_hours.${day}.${match[2]}`] = errors[key];
            } else {
                indexedErrors[key] = errors[key];
            }
        });

        return (
            <DayBusinessHours
                key={day}
                day={day}
                dayData={data.business_hours[index]}
                errors={{ ...indexedErrors, ...validationErrors }}
                timeslots={timeslots}
                formatTimeSlot={formatTimeSlot}
                handleSwitchChange={handleSwitchChange}
                handleTimeChange={handleTimeChange}
            />
        );
    };

    return (
        <ResubmitForm
            title="Business Hours"
            icon="AlarmClock"
        >
            <form onSubmit={submit}>
                <div className='flex-grow'>
                    {daysOfWeek.map((day, index) => renderDaySection(day, index))}

                    {errors.business_hours && typeof errors.business_hours === 'string' && (
                        <p className="text-red-500 text-xs mt-2">{errors.business_hours}</p>
                    )}
                    {Object.keys(errors)
                        .filter(key => !key.startsWith('business_hours.') && key !== 'business_hours')
                        .map(key => (
                            <p key={key} className="text-red-500 text-xs mt-1">{errors[key]}</p>
                        ))}
                </div>
                {dataChanged && (
                    <motion.div
                        className="flex justify-end mt-5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <Button type="submit" disabled={processing}>
                            Save
                        </Button>
                    </motion.div>
                )}
            </form>
        </ResubmitForm>
    );
}

export default React.memo(BusinessHours);