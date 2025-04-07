import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Edit({ gender }: { gender: any }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        gender: gender.gender || '',
    });

    const [updating, setUpdating] = useState(false); // For the Update button
    const [cancelling, setCancelling] = useState(false); // For the Cancel button (previously Reset)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true); // Set the updating state to true when submitting
        put(`/utilities/crab/genders/${gender.id}`, {
            onSuccess: () => {
                reset();
                setUpdating(false); // Reset the updating state when done
            },
            onError: () => {
                setUpdating(false); // Reset the updating state on error
            },
        });
    };

    const handleCancel = () => {
        setCancelling(true);
    };

    return (
        <AppLayout>
            <Head title={`Edit Gender - ${gender.gender}`} />
            <div className="py-12">
                <div className="mx-auto max-w-xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <h1 className="mb-6 text-xl font-semibold">Edit Gender</h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="gender">Gender</Label>
                                <Input
                                    id="gender"
                                    name="gender"
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    type="text"
                                    placeholder="Enter gender (e.g., male, female, undetermined)"
                                    className="mt-1"
                                />
                                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Link href="/utilities/crab/genders/" onClick={handleCancel}>
                                    <Button variant="outline" disabled={processing || cancelling}>
                                        {cancelling ? (
                                            <span className="flex items-center">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Cancelling...
                                            </span>
                                        ) : (
                                            'Cancel'
                                        )}
                                    </Button>
                                </Link>

                                <Button type="submit" disabled={processing || updating}>
                                    {updating ? (
                                        <span className="flex items-center">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </span>
                                    ) : (
                                        'Update'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
