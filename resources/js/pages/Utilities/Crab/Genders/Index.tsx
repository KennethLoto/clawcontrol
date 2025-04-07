import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Loader2, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Gender {
    id: number;
    gender: string;
    created_at: string;
    updated_at: string;
}

type PageProps = {
    flash?: {
        success?: string;
        error?: string;
    };
    genders: Gender[];
};

export default function Index() {
    const { props } = usePage<PageProps>();
    const { flash, genders } = props;
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [genderToDelete, setGenderToDelete] = useState<Gender | null>(null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleDeleteClick = (gender: Gender) => {
        setGenderToDelete(gender);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!genderToDelete) return;

        setDeletingId(genderToDelete.id);
        router.delete(`/utilities/crab/genders/${genderToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingId(null);
                setIsDialogOpen(false);
            },
            onError: () => {
                setDeletingId(null);
                setIsDialogOpen(false);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Genders" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-xl font-bold">Genders</h1>
                        <Link href="/utilities/crab/genders/create">
                            <Button>
                                <PlusCircle className="h-4 w-4" />
                                Add Gender
                            </Button>
                        </Link>
                    </div>

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete the gender "{genderToDelete?.gender}"? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleConfirmDelete} disabled={deletingId === genderToDelete?.id}>
                                    {deletingId === genderToDelete?.id ? (
                                        <span className="flex items-center">
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Deleting...
                                        </span>
                                    ) : (
                                        'Delete'
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {genders.length > 0 ? (
                                    genders.map((gender, index) => (
                                        <TableRow key={gender.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{gender.gender}</TableCell>
                                            <TableCell>{new Date(gender.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="space-x-2">
                                                <Link href={`/utilities/crab/genders/${gender.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(gender)}>
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                            No genders found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
