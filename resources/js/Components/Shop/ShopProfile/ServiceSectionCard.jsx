import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Scissors, ArrowUpRight } from "lucide-react";
import { Link } from "@inertiajs/react";
export default function ServiceSectionCard({ shop }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <Link className="flex items-center gap-2 hover:underline" href={`/shop/catalog`}>
                        <Scissors className="h-5 w-5" />
                        <span>Services ({shop.shop_service_categories.length})</span>
                    </Link>
                    <Link href={`/shop/catalog`} className="flex items-center gap-2 hover:underline">
                        <span className="text-sm text-accent-foreground">View All</span>
                        <ArrowUpRight className="h-5 w-5" />
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    {shop.shop_service_categories.slice(0, 6).map(
                        (service, index) => (
                            <div
                                key={index}
                                className="border rounded-lg p-4"
                            >
                                <h3 className="font-medium">
                                    {service.service_name}
                                </h3>
                                <div className="mt-2 space-y-1 text-sm">
                                    <p className="text-green-600 font-bold">
                                        Php {service.cost}
                                    </p>
                                    <p className="text-muted-foreground">
                                        Duration:{" "}
                                        {service.duration_hour + ' hours ' + service.duration_minute + ' minutes'}
                                    </p>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </CardContent>
        </Card>
    )
}