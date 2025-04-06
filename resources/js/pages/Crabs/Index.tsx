import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, LoaderCircle, Pencil, PlusCircle, Search, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Crabs',
        href: '/crabs',
    },
];

type Crab = {
    id: string;
    tag_id: string;
    species: string;
    age_value: string;
    age_unit: string;
    weight: number;
    gender: string;
    health_status: string;
    created_at: string;
    updated_at: string;
};

type PageProps = {
    crabs: Crab[];
    flash?: {
        success?: string;
        error?: string;
    };
};

const GENDER_OPTIONS = ['All', 'Male', 'Female', 'Undetermined'];
const HEALTH_STATUS_OPTIONS = ['All', 'Healthy', 'Weak', 'Diseased'];

const createColumns = (handleDeleteClick: (id: string) => void) => [
    {
        id: 'number',
        header: '#',
        cell: (_: Crab, index: number) => index + 1,
    },
    {
        id: 'tag_id',
        header: 'Tag ID',
        cell: (crab: Crab) => crab.tag_id,
    },
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
        cell: (crab: Crab) => (
            <Badge variant="outline" className="border-gray-400 dark:border-gray-500">
                {crab.gender}
            </Badge>
        ),
    },
    {
        id: 'health_status',
        header: 'Health Status',
        cell: (crab: Crab) => {
            if (crab.health_status === 'Healthy') return <Badge className="bg-green-500 dark:bg-green-600">{crab.health_status}</Badge>;
            if (crab.health_status === 'Weak') return <Badge className="bg-yellow-500 dark:bg-yellow-600">{crab.health_status}</Badge>;
            if (crab.health_status === 'Diseased') return <Badge className="bg-destructive">{crab.health_status}</Badge>;
            return crab.health_status;
        },
    },
    {
        id: 'created_at',
        header: 'Added At',
        cell: (crab: Crab) => {
            const date = new Date(crab.created_at);
            return date.toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                month: 'long',
                day: 'numeric',
                year: 'numeric',
            });
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: (crab: Crab) => (
            <div className="flex gap-2">
                <Link href={`/crabs/${crab.id}/edit`} prefetch>
                    <Button
                        variant="outline"
                        className="hover:border-primary hover:bg-primary/10 hover:text-primary dark:hover:border-primary dark:hover:bg-primary/20 border-gray-400 transition-all duration-200 hover:scale-[1.05] hover:shadow-sm dark:border-gray-600"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                </Link>
                <Button
                    variant="destructive"
                    className="hover:bg-destructive/90 transition-all duration-200 hover:scale-[1.05] hover:shadow-sm"
                    onClick={() => handleDeleteClick(crab.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];

export default function Index({ crabs: initialCrabs }: { crabs: Crab[] }) {
    const { flash } = usePage<PageProps>().props;
    const [processingDelete, setProcessingDelete] = useState(false);
    const [isDelayed, setIsDelayed] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [crabToDelete, setCrabToDelete] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [genderFilter, setGenderFilter] = useState('All');
    const [healthStatusFilter, setHealthStatusFilter] = useState('All');
    const [removalReason, setRemovalReason] = useState<string | null>(null);

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
        if (crabToDelete && removalReason) {
            setProcessingDelete(true); // Start loading
            router.delete(`/crabs/${crabToDelete}`, {
                data: { removal_reason: removalReason },
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setRemovalReason(null);
                    setProcessingDelete(false); // Stop loading
                },
                onError: () => {
                    setProcessingDelete(false); // Stop loading on error too
                },
            });
        } else {
            toast.error('Please select a removal reason.');
        }
    };

    const handleDialogClose = () => {
        setDeleteDialogOpen(false);
        setProcessingDelete(false);
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
                crab.tag_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            <div className="container mx-auto p-4">
                <Card className="bg-white dark:bg-gray-900">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-lg dark:text-white">Crabs List</CardTitle>
                        <Link href="/crabs/create" prefetch>
                            <Button asChild variant="default" className="border-gray-600 dark:border-gray-700">
                                <span className="flex items-center gap-2">
                                    <PlusCircle className="h-4 w-4" />
                                    Add Crab
                                </span>
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Filters and Controls */}
                        <div className="flex flex-col gap-4">
                            {/* Mobile Search - Shown only on small screens */}
                            <div className="block sm:hidden">
                                <div className="relative w-full">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 dark:text-gray-500" />
                                    <Input
                                        placeholder="Search crabs..."
                                        className="border-gray-400 pl-10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                {/* Left side - Filters */}
                                <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:items-center sm:gap-4">
                                    <div className="col-span-2 sm:col-auto">
                                        <Select
                                            value={itemsPerPage.toString()}
                                            onValueChange={(value) => {
                                                setItemsPerPage(Number(value));
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <SelectTrigger className="w-full border-gray-400 sm:w-18 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                                                <SelectValue placeholder="10" />
                                            </SelectTrigger>
                                            <SelectContent className="dark:bg-gray-800 dark:text-white">
                                                {[5, 10, 20, 50, 100].map((size) => (
                                                    <SelectItem key={size} value={size.toString()} className="dark:hover:bg-gray-700">
                                                        {size}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="col-span-1">
                                        <Select
                                            value={genderFilter}
                                            onValueChange={(value) => {
                                                setGenderFilter(value);
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <SelectTrigger className="w-full border-gray-400 sm:w-32 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                                                <SelectValue placeholder="Gender" />
                                            </SelectTrigger>
                                            <SelectContent className="dark:bg-gray-800 dark:text-white">
                                                {GENDER_OPTIONS.map((gender) => (
                                                    <SelectItem key={gender} value={gender} className="dark:hover:bg-gray-700">
                                                        {gender}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="col-span-1">
                                        <Select
                                            value={healthStatusFilter}
                                            onValueChange={(value) => {
                                                setHealthStatusFilter(value);
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <SelectTrigger className="w-full border-gray-400 sm:w-32 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                                                <SelectValue placeholder="Health Status" />
                                            </SelectTrigger>
                                            <SelectContent className="dark:bg-gray-800 dark:text-white">
                                                {HEALTH_STATUS_OPTIONS.map((status) => (
                                                    <SelectItem key={status} value={status} className="dark:hover:bg-gray-700">
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {hasFilters && (
                                        <div className="col-span-2 sm:col-auto">
                                            <Button
                                                variant="ghost"
                                                onClick={clearFilters}
                                                className="flex w-full items-center gap-1 text-gray-600 hover:text-gray-900 sm:w-auto dark:text-gray-400 dark:hover:text-gray-100"
                                            >
                                                <X className="h-4 w-4" />
                                                Clear filters
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Desktop Search - Shown only on larger screens */}
                                <div className="hidden sm:block">
                                    <div className="relative w-full sm:w-64">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 dark:text-gray-500" />
                                        <Input
                                            placeholder="Search crabs..."
                                            className="border-gray-400 pl-10 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-md border border-gray-200 dark:border-gray-700">
                            <Table>
                                <TableHeader className="bg-gray-100 dark:bg-gray-800">
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableHead key={column.id} className="pl-5 dark:text-white">
                                                {column.header}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedCrabs.length > 0 ? (
                                        paginatedCrabs.map((crab, index) => (
                                            <TableRow key={crab.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                {columns.map((column) => (
                                                    <TableCell key={`${crab.id}-${column.id}`} className="pl-5 dark:text-gray-300">
                                                        {column.cell(crab, index + (currentPage - 1) * itemsPerPage)}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center dark:text-gray-300">
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
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCrabs.length)} of{' '}
                                    {filteredCrabs.length} crabs
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
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
                                                    className="dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}
                                        {totalPages > 5 && currentPage < totalPages - 2 && (
                                            <>
                                                <span className="px-2 text-gray-600 dark:text-gray-400">...</span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(totalPages)}
                                                    className="dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                                                >
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
                                        className="dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className="dark:bg-gray-900 dark:text-white">
                    <DialogHeader>
                        <DialogTitle className="dark:text-white">Confirm Deletion</DialogTitle>
                        <DialogDescription className="dark:text-gray-400">
                            Are you sure you want to delete this crab? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mb-4">
                        <Select value={removalReason || ''} onValueChange={(value: string) => setRemovalReason(value)}>
                            <SelectTrigger className="w-full border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                                <SelectValue placeholder="Select a removal reason" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-gray-800 dark:text-white">
                                <SelectItem value="Sold">Sold</SelectItem>
                                <SelectItem value="Died">Died</SelectItem>
                                <SelectItem value="Harvested">Harvested</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            className="dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm} disabled={processingDelete}>
                            {processingDelete ? (
                                <span className="flex items-center gap-2">
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                    Deleting...
                                </span>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
