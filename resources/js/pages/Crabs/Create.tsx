import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { BadgeCheck, Check, ChevronsUpDown, CircleX, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Crabs',
        href: '/crabs',
    },
    {
        title: 'Add',
        href: '/crabs/create',
    },
];

interface CreateProps {
    ponds: Array<{
        id: string;
        pond_id: string;
        location: string;
    }>;
    enums: {
        species: Array<{ value: string; label: string }>;
        age_unit: Array<{ value: string; label: string }>;
        gender: Array<{ value: string; label: string }>;
        health_status: Array<{ value: string; label: string }>;
    };
}

export default function Create({ ponds, enums }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        tag_id: '',
        species: '',
        age_value: '',
        age_unit: '',
        weight: '',
        gender: '',
        health_status: '',
        pond_id: '',
    });

    const [processingCancel, setProcessingCancel] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/crabs');
    };

    const handleCancel = () => {
        setProcessingCancel(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add New Crab" />
            <div className="container mx-auto p-4">
                <Card className="mx-auto max-w-lg">
                    <CardHeader>
                        <CardTitle className="text-center">Add New Crab</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Pond Selection Field - Updated with proper search */}
                            <div className="grid gap-2">
                                <Label htmlFor="pond_id">Pond</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn('w-full justify-between', !data.pond_id && 'text-muted-foreground')}
                                        >
                                            {data.pond_id
                                                ? ponds.find((pond) => pond.id === data.pond_id)?.pond_id +
                                                  ' - ' +
                                                  ponds.find((pond) => pond.id === data.pond_id)?.location
                                                : 'Select pond...'}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search pond by ID or location..." />
                                            <CommandEmpty>No pond found.</CommandEmpty>
                                            <CommandGroup>
                                                {ponds.map((pond) => (
                                                    <CommandItem
                                                        value={`${pond.pond_id} ${pond.location}`} // This makes both ID and location searchable
                                                        key={pond.id}
                                                        onSelect={() => {
                                                            setData('pond_id', pond.id);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn('mr-2 h-4 w-4', data.pond_id === pond.id ? 'opacity-100' : 'opacity-0')}
                                                        />
                                                        {pond.pond_id} - {pond.location}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <InputError className="mt-2" message={errors.pond_id} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Species Field - Updated to use enums */}
                                <div className="grid gap-2">
                                    <Label htmlFor="species">Species</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn('w-full justify-between', !data.species && 'text-muted-foreground')}
                                            >
                                                {data.species
                                                    ? enums.species.find((species) => species.value === data.species)?.label
                                                    : 'Select species...'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search species..." />
                                                <CommandEmpty>No species found.</CommandEmpty>
                                                <CommandGroup>
                                                    {enums.species.map((species) => (
                                                        <CommandItem
                                                            value={species.value}
                                                            key={species.value}
                                                            onSelect={() => {
                                                                setData('species', species.value);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    data.species === species.value ? 'opacity-100' : 'opacity-0',
                                                                )}
                                                            />
                                                            {species.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <InputError className="mt-2" message={errors.species} />
                                </div>

                                {/* Gender Field - Updated to use enums */}
                                <div className="grid gap-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn('w-full justify-between', !data.gender && 'text-muted-foreground')}
                                            >
                                                {data.gender
                                                    ? enums.gender.find((gender) => gender.value === data.gender)?.label
                                                    : 'Select gender...'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search gender..." />
                                                <CommandEmpty>No gender found.</CommandEmpty>
                                                <CommandGroup>
                                                    {enums.gender.map((gender) => (
                                                        <CommandItem
                                                            value={gender.value}
                                                            key={gender.value}
                                                            onSelect={() => {
                                                                setData('gender', gender.value);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    data.gender === gender.value ? 'opacity-100' : 'opacity-0',
                                                                )}
                                                            />
                                                            {gender.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <InputError className="mt-2" message={errors.gender} />
                                </div>
                            </div>

                            {/* Age Fields - Updated to use enums */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="age_value">Age Value</Label>
                                    <Input
                                        id="age_value"
                                        type="number"
                                        value={data.age_value}
                                        onChange={(e) => setData('age_value', e.target.value)}
                                        min="0"
                                        placeholder="e.g. 1"
                                    />
                                    <InputError className="mt-2" message={errors.age_value} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="age_unit">Age Unit</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn('w-full justify-between', !data.age_unit && 'text-muted-foreground')}
                                            >
                                                {data.age_unit
                                                    ? enums.age_unit.find((unit) => unit.value === data.age_unit)?.label
                                                    : 'Select unit...'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search unit..." />
                                                <CommandEmpty>No unit found.</CommandEmpty>
                                                <CommandGroup>
                                                    {enums.age_unit.map((unit) => (
                                                        <CommandItem
                                                            value={unit.value}
                                                            key={unit.value}
                                                            onSelect={() => {
                                                                setData('age_unit', unit.value);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    data.age_unit === unit.value ? 'opacity-100' : 'opacity-0',
                                                                )}
                                                            />
                                                            {unit.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <InputError className="mt-2" message={errors.age_unit} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Weight Field */}
                                <div className="grid gap-2">
                                    <Label htmlFor="weight">Weight (g)</Label>
                                    <Input
                                        id="weight"
                                        type="number"
                                        step="0.01"
                                        value={data.weight}
                                        onChange={(e) => setData('weight', e.target.value)}
                                        min="0"
                                        placeholder="e.g. 150"
                                    />
                                    <InputError className="mt-2" message={errors.weight} />
                                </div>

                                {/* Health Status Field - Updated to use enums */}
                                <div className="grid gap-2">
                                    <Label htmlFor="health_status">Health Status</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn('w-full justify-between', !data.health_status && 'text-muted-foreground')}
                                            >
                                                {data.health_status
                                                    ? enums.health_status.find((status) => status.value === data.health_status)?.label
                                                    : 'Select status...'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search status..." />
                                                <CommandEmpty>No status found.</CommandEmpty>
                                                <CommandGroup>
                                                    {enums.health_status.map((status) => (
                                                        <CommandItem
                                                            value={status.value}
                                                            key={status.value}
                                                            onSelect={() => {
                                                                setData('health_status', status.value);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    'mr-2 h-4 w-4',
                                                                    data.health_status === status.value ? 'opacity-100' : 'opacity-0',
                                                                )}
                                                            />
                                                            {status.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <InputError className="mt-2" message={errors.health_status} />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end gap-4">
                                <Button asChild variant="outline" className="border-gray-400" disabled={processingCancel}>
                                    {processingCancel ? (
                                        <span className="flex items-center gap-2">
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            Cancelling...
                                        </span>
                                    ) : (
                                        <Link href="/crabs" className="flex items-center gap-2" onClick={handleCancel}>
                                            <CircleX className="h-4 w-4" />
                                            Cancel
                                        </Link>
                                    )}
                                </Button>

                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <BadgeCheck className="h-4 w-4" />
                                            Save Crab
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
