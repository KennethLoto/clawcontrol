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
import { ChevronLeft, ChevronRight, Eye, LoaderCircle, Pencil, PlusCircle, Search, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ponds',
        href: '/ponds',
    },
];

type Pond = {
    id: string;
    tag_id: string;
    location: string; // Changed from enum to string
    size: number;
    water_type: 'Brackish' | 'Fresh';
    setup_date: string; // Changed from initial_setup_date to match form
    created_at: string;
    updated_at: string;
};

type PageProps = {
    ponds: Pond[];
    flash?: {
        success?: string;
        error?: string;
    };
};

const LOCATION_OPTIONS = ['All', 'Inland Brackish Pond Zone', 'Coastal Pond Zone', 'River Pond Area'];
const WATER_TYPE_OPTIONS = ['All', 'Brackish', 'Fresh'];

const createColumns = (handleDeleteClick: (id: string) => void) => [
    {
        id: 'number',
        header: '#',
        cell: (_: Pond, index: number) => index + 1,
    },
    {
        id: 'tag_id',
        header: 'Tag ID',
        cell: (pond: Pond) => pond.tag_id,
    },
    {
        id: 'location',
        header: 'Location',
        cell: (pond: Pond) => pond.location, // Changed from Badge to plain text
    },
    {
        id: 'size',
        header: 'Size (ha)',
        cell: (pond: Pond) => `${pond.size.toFixed(2)} ha`,
    },
    {
        id: 'water_type',
        header: 'Water Type',
        cell: (pond: Pond) => (
            <Badge variant="outline" className="text-foreground">
                {pond.water_type}
            </Badge>
        ),
    },
    {
        id: 'setup_date',
        header: 'Setup Date',
        cell: (pond: Pond) => {
            try {
                return new Date(pond.setup_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });
            } catch (e) {
                return pond.setup_date; // Fallback to raw value if date parsing fails
            }
        },
    },
    {
        id: 'created_at',
        header: 'Created At',
        cell: (pond: Pond) =>
            new Date(pond.created_at).toLocaleDateString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }),
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: (pond: Pond) => (
            <div className="flex gap-2">
                {/* View Button */}
                <Link href={`/ponds/${pond.id}`}>
                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:bg-blue-400/20"
                        title="View pond details"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>

                {/* Edit Button */}
                <Link href={`/ponds/${pond.id}/edit`}>
                    <Button
                        variant="outline"
                        size="sm"
                        className="hover:border-primary hover:bg-primary/10 hover:text-primary dark:hover:border-primary dark:hover:bg-primary/20"
                        title="Edit pond"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                </Link>

                {/* Delete Button */}
                <Button
                    variant="destructive"
                    size="sm"
                    className="hover:bg-destructive/90"
                    onClick={() => handleDeleteClick(pond.id)}
                    title="Delete pond"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        ),
    },
];

export default function Index({ ponds: initialPonds }: PageProps) {
    const { flash } = usePage<PageProps>().props;
    const [processingDelete, setProcessingDelete] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [pondToDelete, setPondToDelete] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [locationFilter, setLocationFilter] = useState('All');
    const [waterTypeFilter, setWaterTypeFilter] = useState('All');
    const [removalReason, setRemovalReason] = useState<string | null>(null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleDeleteClick = (pondId: string) => {
        setPondToDelete(pondId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (pondToDelete && removalReason) {
            setProcessingDelete(true);
            router.delete(`/ponds/${pondToDelete}`, {
                data: { removal_reason: removalReason },
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setRemovalReason(null);
                    setProcessingDelete(false);
                    toast.success('Pond deleted successfully');
                },
                onError: () => {
                    setProcessingDelete(false);
                    toast.error('Failed to delete pond');
                },
            });
        } else {
            toast.error('Please select a removal reason.');
        }
    };

    const handleDialogClose = () => {
        setDeleteDialogOpen(false);
        setProcessingDelete(false);
        setRemovalReason(null);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setLocationFilter('All');
        setWaterTypeFilter('All');
        setCurrentPage(1);
    };

    // Filter ponds based on search and filters
    const filteredPonds = useMemo(() => {
        return initialPonds.filter((pond) => {
            // Search term matching (case insensitive)
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                pond.location.toLowerCase().includes(searchLower) ||
                pond.water_type.toLowerCase().includes(searchLower) ||
                pond.size.toString().includes(searchTerm) ||
                pond.setup_date.toLowerCase().includes(searchLower);

            // Exact match for location filter
            const matchesLocation = locationFilter === 'All' || pond.location === locationFilter;

            // Exact match for water type filter
            const matchesWaterType = waterTypeFilter === 'All' || pond.water_type === waterTypeFilter;

            return matchesSearch && matchesLocation && matchesWaterType;
        });
    }, [initialPonds, searchTerm, locationFilter, waterTypeFilter]);

    const totalPages = Math.ceil(filteredPonds.length / itemsPerPage);
    const paginatedPonds = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredPonds.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredPonds, currentPage, itemsPerPage]);

    const columns = createColumns(handleDeleteClick);

    const hasFilters = searchTerm || locationFilter !== 'All' || waterTypeFilter !== 'All';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ponds List" />
            <div className="container mx-auto p-4">
                <Card className="bg-white dark:bg-gray-900">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-lg dark:text-white">Ponds List</CardTitle>
                        <Link href="/ponds/create">
                            <Button variant="default" className="border-gray-600 dark:border-gray-700">
                                <span className="flex items-center gap-2">
                                    <PlusCircle className="h-4 w-4" />
                                    Create Pond
                                </span>
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-4">
                            {/* Mobile Search */}
                            <div className="block sm:hidden">
                                <div className="relative w-full">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 dark:text-gray-500" />
                                    <Input
                                        placeholder="Search ponds..."
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
                                {/* Filters */}
                                <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:items-center sm:gap-4">
                                    <div className="col-span-2 sm:col-auto">
                                        <Select
                                            value={itemsPerPage.toString()}
                                            onValueChange={(value) => {
                                                setItemsPerPage(Number(value));
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <SelectTrigger className="w-full border-gray-400 sm:w-20 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
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
                                            value={locationFilter}
                                            onValueChange={(value) => {
                                                setLocationFilter(value);
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <SelectTrigger className="w-full border-gray-400 sm:w-40 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                                                <SelectValue placeholder="Location" />
                                            </SelectTrigger>
                                            <SelectContent className="dark:bg-gray-800 dark:text-white">
                                                {LOCATION_OPTIONS.map((location) => (
                                                    <SelectItem key={location} value={location} className="dark:hover:bg-gray-700">
                                                        {location}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="col-span-1">
                                        <Select
                                            value={waterTypeFilter}
                                            onValueChange={(value) => {
                                                setWaterTypeFilter(value);
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <SelectTrigger className="w-full border-gray-400 sm:w-32 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                                                <SelectValue placeholder="Water Type" />
                                            </SelectTrigger>
                                            <SelectContent className="dark:bg-gray-800 dark:text-white">
                                                {WATER_TYPE_OPTIONS.map((type) => (
                                                    <SelectItem key={type} value={type} className="dark:hover:bg-gray-700">
                                                        {type}
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

                                {/* Desktop Search */}
                                <div className="hidden sm:block">
                                    <div className="relative w-full sm:w-64">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 dark:text-gray-500" />
                                        <Input
                                            placeholder="Search ponds..."
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
                                    {paginatedPonds.length > 0 ? (
                                        paginatedPonds.map((pond, index) => (
                                            <TableRow key={pond.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                {columns.map((column) => (
                                                    <TableCell key={`${pond.id}-${column.id}`} className="pl-5 dark:text-gray-300">
                                                        {column.cell(pond, index + (currentPage - 1) * itemsPerPage)}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center dark:text-gray-300">
                                                {filteredPonds.length === 0 && (searchTerm || locationFilter !== 'All' || waterTypeFilter !== 'All')
                                                    ? 'No ponds match your filters.'
                                                    : 'No ponds found.'}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {filteredPonds.length > 0 && (
                            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPonds.length)} of{' '}
                                    {filteredPonds.length} ponds
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
                            Are you sure you want to delete this pond? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mb-4">
                        <Select value={removalReason || ''} onValueChange={(value: string) => setRemovalReason(value)}>
                            <SelectTrigger className="w-full border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                                <SelectValue placeholder="Select a removal reason" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-gray-800 dark:text-white">
                                <SelectItem value="Decommissioned">Decommissioned</SelectItem>
                                <SelectItem value="Renovation">Renovation</SelectItem>
                                <SelectItem value="Damaged">Damaged</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleDialogClose} className="dark:border-gray-700 dark:text-white dark:hover:bg-gray-800">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteConfirm} disabled={processingDelete || !removalReason}>
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
