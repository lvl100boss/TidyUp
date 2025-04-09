import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, PhilippinePeso, Edit, Trash2, User, NotebookText } from "lucide-react";
import EditAppointmentModal from "./EditAppointmentModal";
import { useConfirm } from "@/hooks/useConfirm";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import ApproveButtonModal from "@/Components/Appointments/ApproveButtonModal";
import RejectButtonModal from "@/Components/Appointments/RejectButtonModal";
import CancelButtonModal from "@/Components/Appointments/CancelButtonModal";
import ReschedReqButton from "@/Components/Appointments/ReschedReqButton";
import StartedButtonModal from "@/Components/Appointments/StartedButtonModal";
import CompleteButtonModal from "@/Components/Appointments/CompleteButtonModal";
import UndoButtonModal from "@/Components/Appointments/UndoButtonModal";
import NoShowButtonModal from "@/Components/Appointments/NoShowButtonModal";


export default function AppointmentCard({ appointment, upcomingSchedules, shopBusinessSchedules, hideActionModals }) {
    const statusVariants = {
        upcoming: "border-blue-300/30 bg-blue-50/50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
        pending: "border-yellow-300/30 bg-yellow-50/50 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300",
        completed: "border-green-300/30 bg-green-50/50 text-green-800 dark:bg-green-950/50 dark:text-green-300",
        cancelled: "border-gray-300/30 bg-gray-50/50 text-gray-800 dark:bg-gray-950/50 dark:text-gray-300",
        "no-show": "border-red-300/30 bg-red-50/50 text-red-800 dark:bg-red-950/50 dark:text-red-300",
        declined: "border-red-300/30 bg-red-50/50 text-red-800 dark:bg-red-950/50 dark:text-red-300",
        started: "border-indigo-300/30 bg-indigo-50/50 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300",
    };

    const totalCost = appointment.services.reduce(
        (sum, service) => sum + parseFloat(service.cost), 0
    );

    return (
        <>
            <Card className="group relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Status accent line */}
                <div className={cn(
                    "absolute left-0 top-0 h-full w-1.5",
                    statusVariants[appointment.status].replace('border', 'bg')
                )} />

                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="size-10 ring-2 ring-white dark:ring-gray-800 shadow-sm">
                                <AvatarImage
                                    src={appointment.customer.profile_photo}
                                    className="group-hover:scale-105 transition-transform"
                                />
                                <AvatarFallback className="text-sm font-medium bg-muted/50">
                                    {appointment.customer.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-lg font-semibold tracking-tight">
                                    {appointment.customer.name}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <User className="h-4 w-4 text-muted-foreground/70" />
                                    {appointment.customer.email}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {appointment.resched_data && (
                                <Badge
                                    variant="secondary"
                                    className="rounded-lg border-2 px-2.5 py-1 font-medium "
                                >
                                    Pending Reschedule
                                </Badge>
                            )}
                            <Badge
                                variant="outline"
                                className={cn(
                                    "rounded-lg capitalize border-2 px-2.5 py-1 font-medium",
                                    statusVariants[appointment.status]
                                )}
                            >
                                {appointment.status === "declined" ? "Rejected" : appointment.status.replace('-', ' ')}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <Separator className="bg-muted-foreground/10" />

                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Schedule Section */}
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Calendar className="h-5 w-5 text-primary/80 shrink-0" />
                                    <span className="font-medium tracking-tight">
                                        {format(parseISO(appointment.date), "EEEE, MMMM dd, yyyy")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Clock className="h-5 w-5 text-primary/80 shrink-0" />
                                    <span className="font-medium tracking-tight">
                                        {format(parseISO(`2023-01-01T${appointment.time}`), "h:mm a")}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm text-muted-foreground font-medium">Total Duration</p>
                                    <p className="font-semibold text-lg">
                                        {appointment.total_duration.hours}h {appointment.total_duration.minutes}m
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Services Section */}
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <h3 className="font-medium text-muted-foreground">Services</h3>
                                <ul className="space-y-2">
                                    {appointment.services.map(service => (
                                        <li
                                            key={service.id}
                                            className="flex justify-between items-center p-2.5 rounded-md bg-muted/20 hover:bg-muted/30 transition-colors"
                                        >
                                            <span className="text-sm font-medium">{service.name}</span>
                                            <span className="text-sm font-semibold flex items-center gap-1 text-primary">
                                                <PhilippinePeso className="h-4 w-4" />
                                                {parseFloat(service.cost).toFixed(2)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Separator className="bg-muted-foreground/10" />

                            <div className="flex justify-between items-center font-semibold text-lg pt-2">
                                <span className="text-muted-foreground">Total</span>
                                <span className="flex items-center gap-1 text-primary">
                                    <PhilippinePeso className="h-5 w-5" />
                                    {totalCost.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {appointment.notes && (
                        <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-muted-foreground/10">
                            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                                <NotebookText className="h-5 w-5 text-primary/80" />
                                <h4 className="text-sm font-medium">Additional Notes</h4>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                                {appointment.notes}
                            </p>
                        </div>
                    )}
                    {appointment.status === "cancelled" && (
                        appointment.cancel_reason ? (
                            <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-muted-foreground/10">
                                <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                                    <NotebookText className="h-5 w-5 text-primary/80" />
                                    <h4 className="text-sm font-medium">Cancellation Reason</h4>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                                    {appointment.cancel_reason}
                                </p>
                            </div>
                        ) : (
                            <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-muted-foreground/10">
                                <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                                    <NotebookText className="h-5 w-5" />
                                    <h4 className="text-sm font-medium">Cancellation Reason</h4>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                                    No reason provided.
                                </p>
                            </div>
                        )
                    )}
                    {appointment.status === "declined" && (
                        appointment.decline_reason ? (
                            <div className="mt-6 p-4 rounded-xl border  border-red-300/30 bg-red-50/50  dark:bg-red-950/50 ">
                                <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                                    <NotebookText className="h-5 w-5 stroke-red-800 dark:stroke-red-300" />
                                    <h4 className="text-sm font-medium text-red-800 dark:text-red-300">Decline Reason</h4>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed pl-7 text-red-800 dark:text-red-300">
                                    {appointment.decline_reason}
                                </p>
                            </div>
                        ) : (
                            <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-muted-foreground/10">
                                <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                                    <NotebookText className="h-5 w-5" />
                                    <h4 className="text-sm font-medium">Decline Reason</h4>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed pl-7">
                                    No reason provided.
                                </p>
                            </div>
                        )
                    )}
                </CardContent>

                <Separator className="bg-muted-foreground/10" />

                <CardFooter className="py-4 flex justify-end gap-2">
                    {!hideActionModals && (
                        <>
                            {appointment.status === "pending" && (
                                <>
                                    <ApproveButtonModal appointment={appointment} />
                                    <ReschedReqButton
                                        appointment={appointment}
                                        upcomingSchedules={upcomingSchedules}
                                        shopBusinessSchedules={shopBusinessSchedules}
                                    />
                                    <RejectButtonModal appointment={appointment} />
                                </>
                            )}

                            {appointment.status === "upcoming" && (
                                <>
                                    <StartedButtonModal appointment={appointment} />
                                    <ReschedReqButton
                                        appointment={appointment}
                                        upcomingSchedules={upcomingSchedules}
                                        shopBusinessSchedules={shopBusinessSchedules}
                                    />
                                    <NoShowButtonModal appointment={appointment} />
                                    <CancelButtonModal appointment={appointment} />
                                </>
                            )}
                            
                            {appointment.status === "started" && (
                                <>
                                    <CompleteButtonModal appointment={appointment} />
                                    <UndoButtonModal appointment={appointment} />
                                </>
                            )}
                        </>
                    )}
                </CardFooter>
            </Card>
        </>
    );
}