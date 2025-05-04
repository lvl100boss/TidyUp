import UserLayout from '@/Layouts/UserLayout'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { Head } from '@inertiajs/react'
import CompletionConfirmationModal from '@/Components/Appointments/CompletionConfirmationModal'

const ViewAppointment = ({
    appointmentId,
    appointment,
    shop,
    shopGallery: gallery,
    staff,
    appointmentServices,
    review,
    status
}) => {
    const [completionModalOpen, setCompletionModalOpen] = useState(false)

    // Check if this appointment needs confirmation when component mounts
    useEffect(() => {
        // Check if we should skip showing the modal based on URL parameter
        const searchParams = new URLSearchParams(window.location.search);
        const skipModal = searchParams.has('skipModal');
        
        if (!skipModal && appointment.status === 'completed' && !appointment.is_user_confirmed) {
            setCompletionModalOpen(true);
        }
    }, [appointment]);

    const staffName = `${staff.staff.first_name} ${staff.staff.last_name}`
    const formattedDate = format(new Date(appointment.date), 'MMMM dd, yyyy')
    const formattedTime = format(new Date(`${appointment.date}T${appointment.time}`), 'hh:mm a')
    const shopAddress = `${shop.detailed_address}, ${shop.barangay}, ${shop.city}, ${shop.province}, ${shop.region}`
    const statusVariants = {
        upcoming: "border-blue-300/30 bg-blue-50/50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
        pending: "border-yellow-300/30 bg-yellow-50/50 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300",
        completed: "border-green-300/30 bg-green-50/50 text-green-800 dark:bg-green-950/50 dark:text-green-300",
        cancelled: "border-gray-300/30 bg-gray-50/50 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300",
        "no-show": "border-red-300/30 bg-red-50/50 text-red-800 dark:bg-red-950/50 dark:text-red-300",
        declined: "border-red-300/30 bg-red-50/50 text-red-800 dark:bg-red-950/50 dark:text-red-300",
        started: "border-indigo-300/30 bg-indigo-50/50 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300",
    };
    
    return (
        <UserLayout>
            <Head title="Appointment" />
            
            {/* Appointment Completion Confirmation Modal */}
            {appointment.status === 'completed' && (
                <CompletionConfirmationModal
                    appointment={appointment}
                    open={completionModalOpen}
                    onOpenChange={setCompletionModalOpen}
                />
            )}
            
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Appointment Details</CardTitle>
                    <CardDescription>Review the details of your appointment.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Shop Information */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Shop Information</h3>
                        <Card>
                            <CardHeader>
                                <CardTitle>{shop.shop_name}</CardTitle>
                                <CardDescription>{shopAddress}</CardDescription>
                                <div className='max-w-md mx-auto'>
                                    <img src={`/${gallery[0].url}`} className='size-full object-cover' />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p>Contact: {shop.contact_number}</p>
                                <p>Email: {shop.email}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Separator className="my-4" />

                    {/* Appointment Details */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Appointment Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium">Date:</p>
                                <p>{formattedDate}</p>
                            </div>
                            <div>
                                <p className="font-medium">Time:</p>
                                <p>{formattedTime}</p>
                            </div>
                            <div>
                                <p className="font-medium">Status:</p>
                                <Badge className={statusVariants[status]}>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</Badge>
                            </div>
                            <div>
                                <p className="font-medium">Total Price:</p>
                                <p>₱{parseFloat(appointment.total_price).toFixed(2)}</p>
                            </div>
                            {appointment.note && (
                                <div className="md:col-span-2">
                                    <p className="font-medium">Note:</p>
                                    <p>{appointment.note}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Staff Information */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Stylist</h3>
                        <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-4">
                                <AvatarImage src={`/storage/${staff.staff.profile_photo_path}`} alt={staffName} />
                                <AvatarFallback>{staffName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <p>{staffName}</p>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Services</h3>
                        {appointmentServices.map((serviceItem) => (
                            <Card key={serviceItem.id} className="mb-2 background-background/50">
                                <CardContent className="pt-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{serviceItem.shop_service.service_name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Duration: {serviceItem.shop_service.duration_hour > 0 ? `${serviceItem.shop_service.duration_hour}h ` : ''}
                                                {serviceItem.shop_service.duration_minute > 0 ? `${serviceItem.shop_service.duration_minute}m` : ''}
                                            </p>
                                        </div>
                                        <p>₱{parseFloat(serviceItem.shop_service.cost).toFixed(2)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </UserLayout>
    )
}

export default ViewAppointment