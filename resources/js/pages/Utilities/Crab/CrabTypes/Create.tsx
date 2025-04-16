import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Create() {
    const { data, setData, post, errors, reset } = useForm({
        crab_type: '',
    });
    const [processing, setProcessing] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        post('/utilities/crab/crabTypes', {
            onSuccess: () => {
                reset();
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    const handleCancel = () => {
        setCancelling(true);
    };

    return (
        <AppLayout>
            <div className="py-12">
                <div className="mx-auto max-w-xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h1 className="mb-6 text-center text-xl font-semibold">Add Crab Type</h1>
                            <div>
                                <Label htmlFor="crab_type">Crab Type</Label>
                                <Input
                                    id="crab_type"
                                    name="crab_type"
                                    value={data.crab_type}
                                    onChange={(e) => setData('crab_type', e.target.value)}
                                    type="text"
                                    placeholder="e.g., Male"
                                    className="mt-1"
                                />
                                {errors.crab_type && <p className="mt-1 text-sm text-red-600">{errors.crab_type}</p>}
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Link href="/utilities/crab/crabType/" onClick={handleCancel}>
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

                                <Button type="submit" disabled={processing || cancelling}>
                                    {processing ? (
                                        <span className="flex items-center">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </span>
                                    ) : (
                                        'Save'
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
