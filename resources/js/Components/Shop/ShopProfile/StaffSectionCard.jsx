import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRight, Users } from "lucide-react";
import { Link } from "@inertiajs/react";
export default function StaffSectionCard({ shop }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <Link href={`/shop/manage/staff`} className="flex items-center gap-2 hover:underline">
                        <Users className="h-5 w-5" />
                        <span>Our Team ({shop.staffs.length})</span>
                    </Link>
                    <Link className="flex items-center gap-2 hover:underline" href={`/shop/manage/staff`}>
                        <span className="text-sm text-accent-foreground">View All</span>
                        <ArrowUpRight className="h-5 w-5" />
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    {shop.staffs.slice(0, 4).map((member, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 border rounded-lg p-4"
                        >
                            <Avatar>
                                <AvatarImage
                                    src={`/storage/${member.staff.profile_photo_path}`}
                                    className="object-cover"
                                />
                                <AvatarFallback>
                                    {member.staff.first_name[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-medium">
                                    {member.staff.first_name}{" "}
                                    {member.staff.last_name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {member.staff.email}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {member.role[0].toUpperCase() + member.role.slice(1)}

                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}