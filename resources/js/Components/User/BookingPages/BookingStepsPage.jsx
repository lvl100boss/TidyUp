import { useState } from "react";
import { useBooking } from "@/Components/User/BookingPages/BookingContext";
import { TimeSlotPicker } from "@/Components/User/BookingPages/TimeSlotPicker";
import { ServiceSelector } from "@/Components/User/BookingPages/ServiceSelector";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { ChevronLeft, LogOut, MapPin, Plus, X } from "lucide-react";
import { Link } from "@inertiajs/react";

function BookingHeader({ shop_id, step }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <Button
                className="figtree-medium"
                variant="ghost"
                disabled={step === 1}
            >
                <ChevronLeft />
                Back
            </Button>
            <h1 className="figtree-medium text-xl">
                Step {step} of 3 -{" "}
                {step === 1
                    ? "Select Time"
                    : step === 2
                    ? "Choose Services"
                    : "Confirm Booking"}
            </h1>
            <Link href={`/${shop_id}/shop`} className="figtree-medium">
                <Button variant="ghost">
                    Back
                    <LogOut className="ml-2" />
                </Button>
            </Link>
        </div>
    );
}

function SummaryCard({ shop, booking }) {
    const total = booking.totalCost.toFixed(2);

    return (
        <Card className="w-[20rem] p-4">
            <div className="aspect-video overflow-hidden rounded-md mb-3">
                <img
                    src={`/${shop.shop_gallery[0].url}`}
                    className="w-full h-full object-cover"
                    alt={shop.shop_name}
                />
            </div>
            <div className="mb-5">
                <h1 className="figtree-medium text-xl">{shop.shop_name}</h1>
                <div className="inline-flex items-center gap-1">
                    <MapPin size={15} className="stroke-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        {shop.detailed_address}
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-between text-lg">
                <h3>Total:</h3>
                <p className="figtree-medium">₱ {total}</p>
            </div>
        </Card>
    );
}

export function StepOnePage({ shop }) {
    const { state, dispatch } = useBooking();
    const [showAddUser, setShowAddUser] = useState(false);

    const handleTimeSlotSelect = (date, time) => {
        dispatch({
            type: "SET_TIME_SLOTS",
            payload: [...state.selectedTimeSlots, { date, time }],
        });
    };

    const handleAddUser = () => {
        // In a real app, this would open a modal or form to add user details
        const newUser = {
            id: Date.now(),
            name: `Guest ${state.additionalUsers.length + 1}`,
        };
        dispatch({ type: "ADD_USER", payload: newUser });
    };

    return (
        <div className="container mx-auto px-4">
            <BookingHeader shop_id={shop.id} step={1} />

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <TimeSlotPicker
                        shop={shop}
                        onSelectTimeSlot={handleTimeSlotSelect}
                    />

                    <div className="mt-6">
                        <Button
                            onClick={() => setShowAddUser(!showAddUser)}
                            variant="outline"
                        >
                            <Plus className="mr-2" />
                            Add Another Person
                        </Button>
                    </div>
                </div>

                <SummaryCard shop={shop} booking={state} />
            </div>

            <div className="mt-6 flex justify-end">
                <Button
                    onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}
                    disabled={state.selectedTimeSlots.length === 0}
                >
                    Continue to Services
                </Button>
            </div>
        </div>
    );
}

export function StepTwoPage({ shop }) {
    const { state, dispatch } = useBooking();

    const handleServiceSelect = (service) => {
        const updatedServices = {
            ...state.selectedServices,
            [service.id]: !state.selectedServices[service.id],
        };
        dispatch({ type: "SET_SERVICES", payload: updatedServices });

        // Update total cost
        const newTotal = Object.entries(updatedServices).reduce(
            (total, [id, selected]) => {
                if (selected) {
                    const service = shop.services.find(
                        (s) => s.id === parseInt(id)
                    );
                    return total + service.cost;
                }
                return total;
            },
            0
        );
        dispatch({ type: "UPDATE_TOTAL", payload: newTotal });
    };

    return (
        <div className="container mx-auto px-4">
            <BookingHeader shop_id={shop.id} step={2} />

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <ServiceSelector
                        services={shop.services}
                        selectedServices={state.selectedServices}
                        onServiceSelect={handleServiceSelect}
                    />
                </div>

                <SummaryCard shop={shop} booking={state} />
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Button
                    variant="outline"
                    onClick={() => dispatch({ type: "SET_STEP", payload: 1 })}
                >
                    Back
                </Button>
                <Button
                    onClick={() => dispatch({ type: "SET_STEP", payload: 3 })}
                    disabled={
                        Object.values(state.selectedServices).filter(Boolean)
                            .length === 0
                    }
                >
                    Review Booking
                </Button>
            </div>
        </div>
    );
}

export function StepThreePage({ shop }) {
    const { state, dispatch } = useBooking();

    const handleConfirmBooking = async () => {
        // Here you would implement the booking confirmation logic
        // This would typically involve an API call to create the appointment
        try {
            // Example API call structure
            // await axios.post('/api/appointments', {
            //     shop_id: shop.id,
            //     date: state.selectedDate,
            //     time_slots: state.selectedTimeSlots,
            //     services: state.selectedServices,
            //     additional_users: state.additionalUsers,
            //     total_cost: state.totalCost
            // });
            // Show success message and redirect
        } catch (error) {
            // Handle error
        }
    };

    return (
        <div className="container mx-auto px-4">
            <BookingHeader shop_id={shop.id} step={3} />

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <Card className="p-6">
                        <h2 className="text-xl font-medium mb-4">
                            Booking Summary
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium">
                                    Selected Time Slots
                                </h3>
                                {state.selectedTimeSlots.map((slot, index) => (
                                    <div
                                        key={index}
                                        className="text-sm text-muted-foreground"
                                    >
                                        {new Date(
                                            slot.date
                                        ).toLocaleDateString()}{" "}
                                        at {slot.time}
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h3 className="font-medium">
                                    Selected Services
                                </h3>
                                {Object.entries(state.selectedServices)
                                    .filter(([_, selected]) => selected)
                                    .map(([id]) => {
                                        const service = shop.services.find(
                                            (s) => s.id === parseInt(id)
                                        );
                                        return (
                                            <div
                                                key={id}
                                                className="flex justify-between text-sm"
                                            >
                                                <span>
                                                    {service.service_name}
                                                </span>
                                                <span>₱{service.cost}</span>
                                            </div>
                                        );
                                    })}
                            </div>

                            {state.additionalUsers.length > 0 && (
                                <div>
                                    <h3 className="font-medium">
                                        Additional People
                                    </h3>
                                    {state.additionalUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="text-sm text-muted-foreground"
                                        >
                                            {user.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <SummaryCard shop={shop} booking={state} />
            </div>

            <div className="mt-6 flex justify-end gap-4">
                <Button
                    variant="outline"
                    onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}
                >
                    Back
                </Button>
                <Button onClick={handleConfirmBooking}>Confirm Booking</Button>
            </div>
        </div>
    );
}
