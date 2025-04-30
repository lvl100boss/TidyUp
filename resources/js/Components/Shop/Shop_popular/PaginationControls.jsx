import { Link } from "@inertiajs/react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationControls({ pagination, baseUrl = "/popular", className = "my-2" }) {
    if (!pagination) return null;
    
    const { currentPage, lastPage } = pagination;
    
    const generatePaginationItems = () => {
        const items = [];
        
        // Add previous page button
        items.push(
            <PaginationItem key="prev">
                <Link
                    href={currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : '#'}
                    preserveScroll
                    preserveState
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                >
                    <PaginationPrevious />
                </Link>
            </PaginationItem>
        );
        
        // First page
        items.push(
            <PaginationItem key={1}>
                <Link
                    href={`${baseUrl}?page=1`}
                    preserveScroll
                    preserveState
                >
                    <PaginationLink isActive={currentPage === 1}>1</PaginationLink>
                </Link>
            </PaginationItem>
        );
        
        // Ellipsis if needed
        if (currentPage > 3) {
            items.push(
                <PaginationItem key="ellipsis1">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }
        
        // Pages around current page
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(lastPage - 1, currentPage + 1); i++) {
            items.push(
                <PaginationItem key={i}>
                    <Link
                        href={`${baseUrl}?page=${i}`}
                        preserveScroll
                        preserveState
                    >
                        <PaginationLink isActive={currentPage === i}>{i}</PaginationLink>
                    </Link>
                </PaginationItem>
            );
        }
        
        // Ellipsis if needed
        if (currentPage < lastPage - 2) {
            items.push(
                <PaginationItem key="ellipsis2">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }
        
        // Last page (if not already included)
        if (lastPage > 1) {
            items.push(
                <PaginationItem key={lastPage}>
                    <Link
                        href={`${baseUrl}?page=${lastPage}`}
                        preserveScroll
                        preserveState
                    >
                        <PaginationLink isActive={currentPage === lastPage}>{lastPage}</PaginationLink>
                    </Link>
                </PaginationItem>
            );
        }
        
        // Add next page button
        items.push(
            <PaginationItem key="next">
                <Link
                    href={currentPage < lastPage ? `${baseUrl}?page=${currentPage + 1}` : '#'}
                    preserveScroll
                    preserveState
                    className={currentPage >= lastPage ? 'pointer-events-none opacity-50' : ''}
                >
                    <PaginationNext />
                </Link>
            </PaginationItem>
        );
        
        return items;
    };
    
    return (
        <Pagination className={className}>
            <PaginationContent>
                {generatePaginationItems()}
            </PaginationContent>
        </Pagination>
    );
}