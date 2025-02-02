import UserLayout from "@/Layouts/UserLayout";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";

import { Head } from "@inertiajs/react";

export default function Faqs() {
    return (
        <UserLayout>
            <Head title="FAQ's" />
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8">
                    Frequently Asked Questions
                </h1>

                <div className="space-y-4">
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                How do I get started?
                            </AccordionTrigger>
                            <AccordionContent>
                                Getting started is easy! Simply create an
                                account and follow our step-by-step guide.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2">
                            <AccordionTrigger>
                                What payment methods do you accept?
                            </AccordionTrigger>
                            <AccordionContent>
                                We accept all major credit cards, PayPal, and
                                bank transfers.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3">
                            <AccordionTrigger>
                                How can I contact support?
                            </AccordionTrigger>
                            <AccordionContent>
                                You can reach our support team via email at
                                support@example.com or through our help desk
                                system.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>
                                What are your business hours?
                            </AccordionTrigger>
                            <AccordionContent>
                                We operate 24/7, with our customer service team
                                available Monday through Friday, 9 AM to 6 PM
                                EST.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-5">
                            <AccordionTrigger>
                                Is there a refund policy?
                            </AccordionTrigger>
                            <AccordionContent>
                                Yes, we offer a 30-day money-back guarantee on
                                all our services. Terms and conditions apply.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-6">
                            <AccordionTrigger>
                                Do you offer international services?
                            </AccordionTrigger>
                            <AccordionContent>
                                Yes, we provide services worldwide with support
                                for multiple languages and currencies.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </UserLayout>
    );
}
