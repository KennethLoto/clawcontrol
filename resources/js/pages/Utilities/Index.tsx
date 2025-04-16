import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { Dna, VenusAndMars } from 'lucide-react';

export default function UtilitiesIndex() {
    return (
        <AppLayout>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Crab Utilities Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Crab Utilities</CardTitle>
                                <CardDescription>Manage crab-related data</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 space-x-4">
                                <Link href="/utilities/crab/genders/" prefetch>
                                    <Button variant="default">
                                        <VenusAndMars className="h-4 w-4"></VenusAndMars>
                                        Gender
                                    </Button>
                                </Link>

                                <Link href="/utilities/crab/species/" prefetch>
                                    <Button variant="default">
                                        <Dna className="h-4 w-4"></Dna>
                                        Species
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Additional Utility Cards can be added here */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pond Utilities</CardTitle>
                                <CardDescription>Coming soon</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button disabled variant="outline" className="w-full">
                                    Pond Metrics
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
