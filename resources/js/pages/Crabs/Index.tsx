import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Crabs',
        href: '/crabs',
    },
];

type Crab = {
    id: string;
    species: string;
    age_value: string;
    age_unit: string;
    weight: number;
    gender: string;
    health_status: string;
    created_at: string;
    updated_at: string;
};

const createColumns = (handleDeleteClick: (id: string) => void) => [
    {
        id: 'species',
        header: 'Species',
        cell: (crab: Crab) => crab.species,
    },
    {
        id: 'age',
        header: 'Age',
        cell: (crab: Crab) => `${crab.age_value} ${crab.age_unit}`,
    },
    {
        id: 'weight',
        header: 'Weight (g)',
        cell: (crab: Crab) => crab.weight,
    },
    {
        id: 'gender',
        header: 'Gender',
        cell: (crab: Crab) => <Badge variant="outline">{crab.gender}</Badge>,
    },
    {
        id: 'health_status',
        header: 'Health Status',
        cell: (crab: Crab) => {
            if (crab.health_status === 'Healthy') return <Badge className="bg-green-500">{crab.health_status}</Badge>;
            if (crab.health_status === 'Weak') return <Badge className="bg-yellow-500">{crab.health_status}</Badge>;
            if (crab.health_status === 'Diseased') return <Badge className="bg-red-500">{crab.health_status}</Badge>;
            return crab.health_status;
        },
    },
    {
        id: 'created_at',
        header: 'Created At',
        cell: (crab: Crab) => new Date(crab.created_at).toLocaleDateString(),
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: (crab: Crab) => (
            <div className="flex justify-end gap-2">
                <Link href={`/crabs/${crab.id}/edit`} prefetch>
                    <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </Link>
                <Button variant="outline" size="icon" onClick={() => handleDeleteClick(crab.id)} className="hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];

export default function Index({ crabs, flash }: { crabs: Crab[]; flash?: { success?: string } }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [crabToDelete, setCrabToDelete] = useState<string | null>(null);

    // Show success toast when coming from a successful creation
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const handleDeleteClick = (crabId: string) => {
        setCrabToDelete(crabId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (crabToDelete) {
            toast.promise(
                new Promise<void>(async (resolve, reject) => {
                    try {
                        await router.delete(`/crabs/${crabToDelete}`);
                        setDeleteDialogOpen(false);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }),
                {
                    loading: 'Deleting crab...',
                    success: () => {
                        return 'Crab deleted successfully';
                    },
                    error: 'Failed to delete crab',
                },
            );
        }
    };

    const columns = createColumns(handleDeleteClick);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crabs List" />
            <div className="container mx-auto space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Crabs</h1>
                    <Link href="/crabs/create" prefetch>
                        <Button asChild variant="outline" className="border-gray-600">
                            <span className="flex items-center gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Create Crab
                            </span>
                        </Button>
                    </Link>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableHead key={column.id} className={column.id === 'actions' ? 'text-right' : ''}>
                                        {column.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {crabs.length > 0 ? (
                                crabs.map((crab) => (
                                    <TableRow key={crab.id}>
                                        {columns.map((column) => (
                                            <TableCell key={`${crab.id}-${column.id}`} className={column.id === 'actions' ? 'text-right' : ''}>
                                                {column.cell(crab)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No crabs found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this crab? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
