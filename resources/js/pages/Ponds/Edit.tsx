import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { BadgeCheck, Check, ChevronsUpDown, CircleX, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs = (id: string): BreadcrumbItem[] => [
    {
        title: 'Ponds',
        href: '/ponds',
    },
    {
        title: 'Edit',
        href: `/ponds/${id}/edit`,
    },
];

const locationOptions = [
    { value: 'Coastal Pond Zone', label: 'Coastal Pond Zone' },
    { value: 'Inland Brackish Pond Zone', label: 'Inland Brackish Pond Zone' },
    { value: 'River Pond Area', label: 'River Pond Area' },
];

const waterTypeOptions = [
    { value: 'Brackish', label: 'Brackish' },
    { value: 'Fresh', label: 'Fresh' },
];

export default function Edit({ pond }: { pond: any }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        location: pond.location,
        size: pond.size,
        water_type: pond.water_type,
        setup_date: pond.setup_date,
        current_ph: pond.current_ph || '',
        current_temperature: pond.current_temperature || '',
        current_oxygen: pond.current_oxygen || '',
        crab_population: pond.crab_population || '',
        water_quality_log: pond.water_quality_log || '',
        maintenance_notes: pond.maintenance_notes || '',
    });

    const [processingCancel, setProcessingCancel] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/ponds/${pond.id}`);
    };

    const handleCancel = () => {
        setProcessingCancel(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs(pond.id)}>
            <Head title="Edit Pond" />
            <div className="container mx-auto p-4">
                <Card className="mx-auto w-full max-w-6xl">
                    <CardHeader>
                        <CardTitle className="text-center">Edit Pond</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit}>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                {/* Column 1: Main Pond Data */}
                                <div className="space-y-6">
                                    <h3 className="text-md border-b pb-2 font-medium">Pond Information</h3>

                                    <div className="grid gap-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn('w-full justify-between', !data.location && 'text-muted-foreground')}
                                                >
                                                    {data.location
                                                        ? locationOptions.find((location) => location.value === data.location)?.label
                                                        : 'Select location...'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search location..." />
                                                    <CommandEmpty>No location found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {locationOptions.map((location) => (
                                                            <CommandItem
                                                                value={location.value}
                                                                key={location.value}
                                                                onSelect={() => {
                                                                    setData('location', location.value);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        'mr-2 h-4 w-4',
                                                                        data.location === location.value ? 'opacity-100' : 'opacity-0',
                                                                    )}
                                                                />
                                                                {location.label}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <InputError className="mt-2" message={errors.location} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="size">Size (m²)</Label>
                                        <Input
                                            id="size"
                                            type="number"
                                            value={data.size}
                                            onChange={(e) => setData('size', e.target.value)}
                                            min="0"
                                            placeholder="e.g. 100"
                                        />
                                        <InputError className="mt-2" message={errors.size} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="water_type">Water Type</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn('w-full justify-between', !data.water_type && 'text-muted-foreground')}
                                                >
                                                    {data.water_type
                                                        ? waterTypeOptions.find((type) => type.value === data.water_type)?.label
                                                        : 'Select water type...'}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search water type..." />
                                                    <CommandEmpty>No water type found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {waterTypeOptions.map((type) => (
                                                            <CommandItem
                                                                value={type.value}
                                                                key={type.value}
                                                                onSelect={() => {
                                                                    setData('water_type', type.value);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        'mr-2 h-4 w-4',
                                                                        data.water_type === type.value ? 'opacity-100' : 'opacity-0',
                                                                    )}
                                                                />
                                                                {type.label}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <InputError className="mt-2" message={errors.water_type} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="setup_date">Setup Date</Label>
                                        <Input
                                            id="setup_date"
                                            type="date"
                                            value={data.setup_date}
                                            onChange={(e) => setData('setup_date', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.setup_date} />
                                    </div>
                                </div>

                                {/* Column 2: Current Parameters */}
                                <div className="space-y-6">
                                    <h3 className="text-md border-b pb-2 font-medium">Current Parameters (Optional)</h3>

                                    <div className="grid gap-2">
                                        <Label htmlFor="current_ph">pH Level</Label>
                                        <Input
                                            id="current_ph"
                                            type="number"
                                            step="0.1"
                                            value={data.current_ph}
                                            onChange={(e) => setData('current_ph', e.target.value)}
                                            placeholder="e.g. 7.5"
                                        />
                                        <InputError className="mt-2" message={errors.current_ph} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="current_temperature">Temperature (°C)</Label>
                                        <Input
                                            id="current_temperature"
                                            type="number"
                                            step="0.1"
                                            value={data.current_temperature}
                                            onChange={(e) => setData('current_temperature', e.target.value)}
                                            placeholder="e.g. 28.5"
                                        />
                                        <InputError className="mt-2" message={errors.current_temperature} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="current_oxygen">Oxygen (mg/L)</Label>
                                        <Input
                                            id="current_oxygen"
                                            type="number"
                                            step="0.1"
                                            value={data.current_oxygen}
                                            onChange={(e) => setData('current_oxygen', e.target.value)}
                                            placeholder="e.g. 6.2"
                                        />
                                        <InputError className="mt-2" message={errors.current_oxygen} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="crab_population">Crab Population</Label>
                                        <Input
                                            id="crab_population"
                                            type="number"
                                            value={data.crab_population}
                                            onChange={(e) => setData('crab_population', e.target.value)}
                                            min="0"
                                            placeholder="e.g. 500"
                                        />
                                        <InputError className="mt-2" message={errors.crab_population} />
                                    </div>
                                </div>

                                {/* Column 3: Logs and Notes */}
                                <div className="space-y-6">
                                    <h3 className="text-md border-b pb-2 font-medium">Logs and Notes (Optional)</h3>

                                    <div className="grid gap-2">
                                        <Label htmlFor="water_quality_log">Water Quality Log</Label>
                                        <Textarea
                                            id="water_quality_log"
                                            value={data.water_quality_log}
                                            onChange={(e) => setData('water_quality_log', e.target.value)}
                                            placeholder="Record water quality changes, treatments, etc."
                                            rows={8}
                                            className="min-h-[110px]"
                                        />
                                        <InputError className="mt-2" message={errors.water_quality_log} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="maintenance_notes">Maintenance Notes</Label>
                                        <Textarea
                                            id="maintenance_notes"
                                            value={data.maintenance_notes}
                                            onChange={(e) => setData('maintenance_notes', e.target.value)}
                                            placeholder="Record maintenance activities, repairs, etc."
                                            rows={8}
                                            className="min-h-[110px]"
                                        />
                                        <InputError className="mt-2" message={errors.maintenance_notes} />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button - Full Width Below Columns */}
                            <div className="mt-8 flex items-center justify-end gap-4">
                                <Button asChild variant="outline" className="border-gray-400" disabled={processingCancel}>
                                    {processingCancel ? (
                                        <span className="flex items-center gap-2">
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            Cancelling...
                                        </span>
                                    ) : (
                                        <Link href="/ponds" className="flex items-center gap-2" onClick={handleCancel}>
                                            <CircleX className="h-4 w-4" />
                                            Cancel
                                        </Link>
                                    )}
                                </Button>

                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <BadgeCheck className="h-4 w-4" />
                                            Update Pond
                                        </>
                                    )}
                                </Button>

                                {recentlySuccessful && <p className="text-muted-foreground text-sm">Updated</p>}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
