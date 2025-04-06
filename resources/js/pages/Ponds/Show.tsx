import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Pencil } from 'lucide-react';

const breadcrumbs = (id: string): BreadcrumbItem[] => [
    {
        title: 'Ponds',
        href: '/ponds',
    },
    {
        title: 'Details',
        href: `/ponds/${id}`,
    },
];

export default function Show({ pond }: { pond: any }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(pond.id)}>
            <Head title="Pond Details" />
            <div className="container mx-auto p-4">
                <Card className="mx-auto w-full max-w-6xl">
                    <CardHeader>
                        <div className="flex flex-col gap-4">
                            <CardTitle className="pb-4 text-left">Pond Details</CardTitle>
                            <div className="-mb-2 flex gap-2">
                                <Link href="/ponds">
                                    <Button variant="outline" className="gap-2">
                                        <ChevronLeft className="h-4 w-4" />
                                        Back
                                    </Button>
                                </Link>
                                <Link href={`/ponds/${pond.id}/edit`}>
                                    <Button variant="outline" className="gap-2">
                                        <Pencil className="h-4 w-4" />
                                        Edit
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {/* Column 1: Main Pond Data */}
                            <div className="space-y-6">
                                <h3 className="text-md border-b pb-2">Pond Information</h3>

                                <div className="grid gap-2">
                                    <p className="text-sm font-medium text-gray-500">Location</p>
                                    <p className="text-sm">{pond.location}</p>
                                </div>

                                <div className="grid gap-2">
                                    <p className="text-sm font-medium text-gray-500">Size (m²)</p>
                                    <p className="text-sm">{pond.size}</p>
                                </div>

                                <div className="grid gap-2">
                                    <p className="text-sm font-medium text-gray-500">Water Type</p>
                                    <p className="text-sm">{pond.water_type}</p>
                                </div>

                                <div className="grid gap-2">
                                    <p className="text-sm font-medium text-gray-500">Setup Date</p>
                                    <p className="text-sm">
                                        {new Date(pond.setup_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Column 2: Current Parameters */}
                            <div className="space-y-6">
                                <h3 className="text-md border-b pb-2">Current Parameters</h3>

                                <div className="grid gap-2">
                                    <p className="text-sm font-medium text-gray-500">pH Level</p>
                                    <p className="text-sm">{pond.current_ph || 'Not recorded'}</p>
                                </div>

                                <div className="grid gap-2">
                                    <p className="text-sm font-medium text-gray-500">Temperature (°C)</p>
                                    <p className="text-sm">{pond.current_temperature || 'Not recorded'}</p>
                                </div>

                                <div className="grid gap-2">
                                    <p className="text-sm font-medium text-gray-500">Oxygen (mg/L)</p>
                                    <p className="text-sm">{pond.current_oxygen || 'Not recorded'}</p>
                                </div>

                                <div className="grid gap-2">
                                    <p className="text-sm font-medium text-gray-500">Crab Population</p>
                                    <p className="text-sm">{pond.crab_population || 'Not recorded'}</p>
                                </div>
                            </div>

                            {/* Column 3: Logs and Notes */}
                            <div className="space-y-6">
                                <h3 className="text-md border-b pb-2">Logs and Notes</h3>

                                <div className="grid gap-2">
                                    <p className="text-sm font-medium text-gray-500">Water Quality Log</p>
                                    <p className="text-sm whitespace-pre-line">{pond.water_quality_log || 'No logs recorded'}</p>
                                </div>

                                <div className="grid gap-2">
                                    <p className="text-sm font-medium text-gray-500">Maintenance Notes</p>
                                    <p className="text-sm whitespace-pre-line">{pond.maintenance_notes || 'No maintenance notes'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
