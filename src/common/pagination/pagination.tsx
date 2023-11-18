import { FC, useMemo } from 'react';
import c from './pagination.module.scss';
import clsx from 'clsx';
import range from 'lodash/range';
import { CPagination, CPaginationItem } from '@coreui/react';

type RtPaginationProps = {
    currentPage: number;
    totalPages: number;
    handleCurrentPageChange: (newCurrentPage: number) => void;
    size?: 'sm' | 'lg';
};

export const PAGINATION_SYMBOLS = {
    leftToEnd: <>&laquo;</>,
    left: <>&#8249;</>,
    dots: <>&#8230;</>,
    right: <>&#8250;</>,
    rightToEnd: <>&raquo;</>,
};

export const PAGINATION_ITEM_CONTENT_TEST_ID = 'rt-pagination-item-content';

const dots = '...';

const Pagination: FC<RtPaginationProps> = (props) => {
    const { currentPage, totalPages, handleCurrentPageChange, size } = props;

    const paginationRange = useMemo(() => {
        const siblingCount = 1;
        const totalShowPages = 5;

        if (totalPages === 0) {
            return [];
        }

        if (currentPage > totalPages) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = range(currentPage - rightItemCount + 2, currentPage);
            if (rightRange[0] <= 1 && currentPage <= 4) {
                const newRightRange = rightRange.filter((num) => num > 0);
                return [...newRightRange, currentPage];
            }
            return [dots, ...rightRange, currentPage];
        }

        if (totalShowPages >= totalPages) {
            return range(1, totalPages + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount + 1, totalPages);
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = range(1, leftItemCount);

            return [...leftRange, dots];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = range(totalPages - rightItemCount + 2, totalPages);
            return [dots, ...rightRange, totalPages];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [dots, ...middleRange, dots];
        }
    }, [currentPage, totalPages]);

    if (!paginationRange) return null;

    const firstPage = 1;
    const lastPage = totalPages;
    const isDisabledStartArrows = firstPage === currentPage || totalPages === 0;
    const isDisabledEndArrows = lastPage === currentPage || totalPages === 0 || currentPage > totalPages;

    return (
        <CPagination className="m-0" size={size}>
            <CPaginationItem
                disabled={isDisabledStartArrows}
                className={clsx(!isDisabledStartArrows && c.cursorPointer, c.notSelect)}
                onClick={() => handleCurrentPageChange(firstPage)}
            >
                <span data-testid={PAGINATION_ITEM_CONTENT_TEST_ID}>{PAGINATION_SYMBOLS.leftToEnd}</span>
            </CPaginationItem>
            <CPaginationItem
                disabled={isDisabledStartArrows}
                className={clsx(!isDisabledStartArrows && c.cursorPointer, c.notSelect)}
                onClick={() => handleCurrentPageChange(currentPage - 1)}
            >
                <span data-testid={PAGINATION_ITEM_CONTENT_TEST_ID}>{PAGINATION_SYMBOLS.left}</span>
            </CPaginationItem>
            {paginationRange.map((pageNumber, index) =>
                pageNumber === dots ? (
                    <CPaginationItem key={index} disabled className={c.notSelect}>
                        <span data-testid={PAGINATION_ITEM_CONTENT_TEST_ID}>{PAGINATION_SYMBOLS.dots}</span>
                    </CPaginationItem>
                ) : (
                    <CPaginationItem
                        key={index}
                        className={clsx(c.cursorPointer, c.notSelect)}
                        active={pageNumber === currentPage}
                        onClick={() => handleCurrentPageChange(pageNumber as number)}
                    >
                        <span data-testid={PAGINATION_ITEM_CONTENT_TEST_ID}>{pageNumber}</span>
                    </CPaginationItem>
                )
            )}
            <CPaginationItem
                disabled={isDisabledEndArrows}
                className={clsx(!isDisabledEndArrows && c.cursorPointer, c.notSelect)}
                onClick={() => handleCurrentPageChange(currentPage + 1)}
            >
                <span data-testid={PAGINATION_ITEM_CONTENT_TEST_ID}>{PAGINATION_SYMBOLS.right}</span>
            </CPaginationItem>
            <CPaginationItem
                disabled={isDisabledEndArrows}
                className={clsx(!isDisabledEndArrows && c.cursorPointer, c.notSelect)}
                onClick={() => handleCurrentPageChange(lastPage)}
            >
                <span data-testid={PAGINATION_ITEM_CONTENT_TEST_ID}>{PAGINATION_SYMBOLS.rightToEnd}</span>
            </CPaginationItem>
        </CPagination>
    );
};

export default Pagination;
