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
        title: 'Create',
        href: '/crabs/create',
    },
];

const speciesOptions = [{ value: 'Mud Crab', label: 'Mud Crab' }];

const ageUnitOptions = [
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
];

const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Undetermined', label: 'Undetermined' },
];

const healthStatusOptions = [
    { value: 'Healthy', label: 'Healthy' },
    { value: 'Weak', label: 'Weak' },
    { value: 'Diseased', label: 'Diseased' },
];

export default function Create() {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        species: '',
        age_value: '',
        age_unit: '',
        weight: '',
        gender: '',
        health_status: '',
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
            <Head title="Create New Crab" />
            <div className="container mx-auto p-4">
                <Card className="mx-auto max-w-lg">
                    <CardHeader>
                        <CardTitle className="text-center">Create New Crab</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Species Field */}
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
                                                ? speciesOptions.find((species) => species.value === data.species)?.label
                                                : 'Select species...'}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search species..." />
                                            <CommandEmpty>No species found.</CommandEmpty>
                                            <CommandGroup>
                                                {speciesOptions.map((species) => (
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

                            {/* Age Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="age_value">Age Value</Label>
                                    <Input
                                        id="age_value"
                                        type="number"
                                        value={data.age_value}
                                        onChange={(e) => setData('age_value', e.target.value)}
                                        min="0"
                                        placeholder="e.g. 3"
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
                                                    ? ageUnitOptions.find((unit) => unit.value === data.age_unit)?.label
                                                    : 'Select unit...'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder="Search unit..." />
                                                <CommandEmpty>No unit found.</CommandEmpty>
                                                <CommandGroup>
                                                    {ageUnitOptions.map((unit) => (
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

                            {/* Weight Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="weight">Weight (kg)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.01"
                                    value={data.weight}
                                    onChange={(e) => setData('weight', e.target.value)}
                                    min="0"
                                    placeholder="e.g. 1.25"
                                />
                                <InputError className="mt-2" message={errors.weight} />
                            </div>

                            {/* Gender Field */}
                            <div className="grid gap-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn('w-full justify-between', !data.gender && 'text-muted-foreground')}
                                        >
                                            {data.gender ? genderOptions.find((gender) => gender.value === data.gender)?.label : 'Select gender...'}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search gender..." />
                                            <CommandEmpty>No gender found.</CommandEmpty>
                                            <CommandGroup>
                                                {genderOptions.map((gender) => (
                                                    <CommandItem
                                                        value={gender.value}
                                                        key={gender.value}
                                                        onSelect={() => {
                                                            setData('gender', gender.value);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn('mr-2 h-4 w-4', data.gender === gender.value ? 'opacity-100' : 'opacity-0')}
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

                            {/* Health Status Field */}
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
                                                ? healthStatusOptions.find((status) => status.value === data.health_status)?.label
                                                : 'Select status...'}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search status..." />
                                            <CommandEmpty>No status found.</CommandEmpty>
                                            <CommandGroup>
                                                {healthStatusOptions.map((status) => (
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

                                {recentlySuccessful && <p className="text-muted-foreground text-sm">Created</p>}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
