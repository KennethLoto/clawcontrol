import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Pencil, PlusCircle, Search, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
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

const GENDER_OPTIONS = ['All', 'Male', 'Female', 'Undetermined'];
const HEALTH_STATUS_OPTIONS = ['All', 'Healthy', 'Weak', 'Diseased'];

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

export default function Index({ crabs: initialCrabs }: { crabs: Crab[] }) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [crabToDelete, setCrabToDelete] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [genderFilter, setGenderFilter] = useState('All');
    const [healthStatusFilter, setHealthStatusFilter] = useState('All');

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

    const clearFilters = () => {
        setSearchTerm('');
        setGenderFilter('All');
        setHealthStatusFilter('All');
        setCurrentPage(1);
    };

    // Filter crabs based on search and filters
    const filteredCrabs = useMemo(() => {
        return initialCrabs.filter((crab) => {
            const matchesSearch =
                crab.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
                crab.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                crab.health_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                crab.age_value.toString().includes(searchTerm) ||
                crab.weight.toString().includes(searchTerm);

            const matchesGender = genderFilter === 'All' || crab.gender === genderFilter;
            const matchesHealthStatus = healthStatusFilter === 'All' || crab.health_status === healthStatusFilter;

            return matchesSearch && matchesGender && matchesHealthStatus;
        });
    }, [initialCrabs, searchTerm, genderFilter, healthStatusFilter]);

    const totalPages = Math.ceil(filteredCrabs.length / itemsPerPage);
    const paginatedCrabs = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredCrabs.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredCrabs, currentPage, itemsPerPage]);

    const columns = createColumns(handleDeleteClick);

    const hasFilters = searchTerm || genderFilter !== 'All' || healthStatusFilter !== 'All';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crabs List" />
            <div className="container mx-auto space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-bold">Crabs List</h1>
                    <Link href="/crabs/create" prefetch>
                        <Button asChild variant="outline" className="border-gray-600">
                            <span className="flex items-center gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Create Crab
                            </span>
                        </Button>
                    </Link>
                </div>

                {/* Filters and Controls */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left side - Filters */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <span className="text-sm text-gray-600">Per page:</span>
                        <Select
                            value={itemsPerPage.toString()}
                            onValueChange={(value) => {
                                setItemsPerPage(Number(value));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue placeholder="10" />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 20, 50, 100].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <span className="text-sm text-gray-600">Gender:</span>
                        <Select
                            value={genderFilter}
                            onValueChange={(value) => {
                                setGenderFilter(value);
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                {GENDER_OPTIONS.map((gender) => (
                                    <SelectItem key={gender} value={gender}>
                                        {gender}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <span className="text-sm text-gray-600">Health Status:</span>
                        <Select
                            value={healthStatusFilter}
                            onValueChange={(value) => {
                                setHealthStatusFilter(value);
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="Health Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {HEALTH_STATUS_OPTIONS.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {hasFilters && (
                            <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                                <X className="h-4 w-4" />
                                Clear filters
                            </Button>
                        )}
                    </div>

                    {/* Right side - Search and items per page */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <Input
                                placeholder="Search crabs..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
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
                            {paginatedCrabs.length > 0 ? (
                                paginatedCrabs.map((crab) => (
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
                                        {filteredCrabs.length === 0 && (searchTerm || genderFilter !== 'All' || healthStatusFilter !== 'All')
                                            ? 'No crabs match your filters.'
                                            : 'No crabs found.'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {filteredCrabs.length > 0 && (
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="text-sm text-gray-600">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCrabs.length)} of{' '}
                            {filteredCrabs.length} crabs
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setCurrentPage(pageNum)}
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                                {totalPages > 5 && currentPage < totalPages - 2 && (
                                    <>
                                        <span className="px-2">...</span>
                                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)}>
                                            {totalPages}
                                        </Button>
                                    </>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
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
